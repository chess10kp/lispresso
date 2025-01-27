import { assert } from "node:console";

const TokenType = {
  LEFTP: "(",
  RIGHTP: ")",
  ADD: "+",
  SUB: "-",
  MUL: "*",
  DIV: "/",
  GT: ">",
  LT: "<",
  GTE: ">=",
  LTE: "<=",
  EQ: "==",
  NEQ: "not =",
  AND: "and",
  OR: "or",
  NOT: "not",
  ASSIGN: "=",
  IDENTIFIER: "identifier",
  UNDEFINED: undefined,
  DO: "do",
  DEF: "def",
  ELSE: "else",
  FN: "fn",
  LET: "let",
  IF: "if",
  NUMBER: "number",
};

const keyWords = new Set([
  "and",
  "do",
  "or",
  "if",
  "else",
  "not",
  "fn",
  "let",
  "def",
]);

const Errors = {
  IMBALANCEDPAREN: "Imabalanced Parenthesis",
  MISMATCHEDTYPE: "Mismatched Type",
  MISMATCHEDPAREN: "Mismatched Parenthesis",
  SYNTAXERROR: "Syntax Error",
  UNKNOWN: "Unknown Error",
  UNKNOWNVARIABLE: "Unknown Variable",
  NAN: "NAN",
};

type Token = {
  type: string;
  value: string;
};

const checkImbalanced = (code: string): Boolean => {
  let parens = 0;
  for (const c of code) {
    if (c == "(") parens += 1;
    if (c == ")") parens -= 1;
  }
  return !parens;
};

class Interpreter {
  private semantic_map = new Map<string, any>();
  private nestedExpressions: Token[][] = [];
  private identifiedTokens: Token[][] = [];
  private tokens: Token[] = [];
  private table: Map<string, Token>[] = [];

  constructor() {}

  eval(code: string): (Error | Token)[] {
    if (!checkImbalanced(code)) return [new Error(Errors.IMBALANCEDPAREN)];
    this.tokenize(code);
    this.nest();
    console.dir(this.nestedExpressions, { depth: null });
    return this.execute();
  }

  execute(): (Token | Error)[] {
    const value = execute(this.nestedExpressions, this.table);
    return value;
  }

  printTokens(): Interpreter {
    for (const token of this.tokens) {
      console.log(token);
    }
    return this;
  }

  getTokens(): Token[] {
    return this.tokens;
  }

  getNested(): Token[][] {
    return this.nestedExpressions;
  }

  tokenize(code: string): void {
    let i = 0;
    while (i < code.length) {
      switch (code.at(i)) {
        case "(":
          this.tokens.push({ type: TokenType.LEFTP, value: "(" });
          i++;
          break;

        case ")":
          i++;
          this.tokens.push({ type: TokenType.RIGHTP, value: ")" });
          break;

        case "+":
          i++;
          this.tokens.push({ type: TokenType.ADD, value: "+" });
          break;

        case "-":
          i++;
          this.tokens.push({ type: TokenType.SUB, value: "-" });
          break;
        case "*":
          i++;
          this.tokens.push({ type: TokenType.MUL, value: "*" });
          break;
        case "/":
          i++;
          this.tokens.push({ type: TokenType.DIV, value: "/" });
          break;

        case ">":
          if (code.at(i + 1) == "=") {
            this.tokens.push({ type: TokenType.GTE, value: ">=" });
            i += 2;
          }
          break;
        case "<":
          if (code.at(i + 1) == "=") {
            this.tokens.push({ type: TokenType.LTE, value: "<=" });
            i += 2;
          }
          break;
        case "=":
          if (code.at(i + 1) == "=") {
            this.tokens.push({ type: TokenType.EQ, value: "==" });
            i += 2;
          } else {
            this.tokens.push({ type: TokenType.ASSIGN, value: "=" });
            i++;
          }
          break;

        case "\n":
        case " ":
          i++;
          break;

        default:
          for (let j = i; j < code.length; j++) {
            if (
              code.at(j) == " " ||
              code.at(j) == "\n" ||
              code.at(j) == ")" ||
              code.at(j) == "("
            ) {
              const ident = code.slice(i, j).toUpperCase();
              // @ts-ignore
              const keyword =
                // @ts-ignore
                TokenType[ident] ||
                (isNaN(parseInt(ident))
                  ? TokenType.IDENTIFIER
                  : TokenType.NUMBER);

              this.tokens.push({
                type: keyword,
                value: code.slice(i, j),
              });

              i = j;
              break;
            }
          }
      }
    }
  }

  nest(): Interpreter {
    this.nestedExpressions = nest(this.tokens);
    if (this.nestedExpressions[0] instanceof Array) {
      // @ts-ignore
      this.nestedExpressions = this.nestedExpressions[0];
    }
    return this;
  }
}

// first arg returns remaining tokens, the second returns all the tokens under the current nesting
const nestAux = (
  tokens: Token[],
  res: Token[][] = [],
): [Token[], Token[][]] => {
  // return [[], []]

  const [current, ...tok] = tokens;
  if (current === undefined) {
    return [tok, res];
  }

  if (current.type == TokenType.LEFTP) {
    const [remaining, nested] = nestAux(tok);
    // @ts-ignore
    return nestAux(remaining, [...res, nested]);
  } else if (current.type == TokenType.RIGHTP) {
    return [tok, res];
  } else {
    // @ts-ignore
    return nestAux(tok, [...res, current]);
  }
};

const nest = (tokens: Token[]): Token[][] => {
  return nestAux(tokens, [])[1];
};

type Symtable = Map<String, any>;

const executeAux = (
  block: (Token | Token[])[] | Token | Token[],
  symtables: Symtable[],
): Token | Error => {
  if (block instanceof Array && !(block[0] instanceof Array)) {
    if (block[0].type == TokenType.DO) {
      const [ele, ...rest] = block;
      for (const block of rest) {
        executeAux(block, symtables);
      }
    } else if (block[0].type == TokenType.DEF) {
      const [_, ident, value] = block;
      if (ident instanceof Array) {
        return new Error(Errors.SYNTAXERROR);
      }

      if (symtables.length == 0) {
        symtables.push(new Map());
      }
      symtables[symtables.length - 1].set(
        ident.value,
        executeAux(value, symtables),
      );
    } else if (block[0].type == TokenType.FN) {
      const [_, ident, ...body] = block;
      if (ident instanceof Array) {
        return new Error(Errors.SYNTAXERROR);
      }
      if (symtables.length == 0) {
        symtables.push(new Map());
      }
      const functionBody = executeAux(body, symtables);
      symtables[symtables.length - 1].set(ident.value, functionBody);
    } else if (block[0].type == TokenType.IDENTIFIER) {
      const [ident, rest] = block;
      const value = getIdent(symtables, ident.value);
      if (value === undefined) {
        return new Error(Errors.UNKNOWNVARIABLE);
      }
      console.log(value);
      return value;
    } else if (block[0].type == TokenType.NUMBER) {
      const [ident, res] = block;
      const value = parseInt(ident.value);
      if (isNaN(value)) {
        return new Error(Errors.NAN);
      }
      return block[0];
    } else if (block[0].type == TokenType.ADD) {
      const [_, ...rest] = block;
      const res = rest.reduce((acc, curr) => {
        if (curr instanceof Array) {
          // @ts-ignore
          return acc.value + parseInt(executeAux(curr, symtables).value);
        } else {
          if (acc instanceof Array || curr instanceof Array) {
            return new Error(Errors.UNKNOWN);
          }
          return {
            type: TokenType.NUMBER,
            value: parseInt(acc.value) + parseInt(curr.value),
          };
        }
      });
      if (res instanceof Array) {
        return new Error(Errors.UNKNOWN);
      }
      return res;
    } else if (block[0].type == TokenType.SUB) {
      const [_, ...rest] = block;
      // @ts-ignore
      const res = rest.reduce((acc, curr) => {
        if (curr instanceof Array) {
          // @ts-ignore
          return acc.value - parseInt(executeAux(curr, symtables).value);
        } else {
          if (acc instanceof Array || curr instanceof Array) {
            return new Error(Errors.UNKNOWN);
          }
          return {
            type: TokenType.NUMBER,
            value: parseInt(acc.value) - parseInt(curr.value),
          };
        }
      });
      if (res instanceof Array) {
        return new Error(Errors.UNKNOWN);
      }
      return res;

    } else if (block[0].type == TokenType.MUL) {
      const [_, ...rest] = block;
      // @ts-ignore
      const res = rest.reduce((acc, curr) => {
        if (curr instanceof Array) {
          // @ts-ignore
          return acc.value * parseInt(executeAux(curr, symtables).value);
        } else {
          if (acc instanceof Array || curr instanceof Array) {
            return new Error(Errors.UNKNOWN);
          }
          return {
            type: TokenType.NUMBER,
            value: parseInt(acc.value) * parseInt(curr.value),
          };
        }
      });
      if (res instanceof Array) {
        return new Error(Errors.UNKNOWN);
      }
      return res;

    } else if (block[0].type == TokenType.DIV) {
      const [_, ...rest] = block;
      // @ts-ignore
      const res = rest.reduce((acc, curr) => {
        if (curr instanceof Array) {
          // @ts-ignore
          return acc.value * parseInt(executeAux(curr, symtables).value);
        } else {
          if (acc instanceof Array || curr instanceof Array) {
            return new Error(Errors.UNKNOWN);
          }
          return {
            type: TokenType.NUMBER,
            value: parseInt(acc.value) / parseInt(curr.value),
          };
        }
      });
      if (res instanceof Array) {
        return new Error(Errors.UNKNOWN);
      }
      return res;

    }
  }
  return { type: "", value: "" };
};

const getIdent = (table: Symtable[], ident: string): any | undefined => {
  if (table.length == 0) {
    return undefined;
  }
  let i = table.length - 1;
  let tab = table[i];
  while (tab) {
    if (tab.has(ident)) {
      return tab.get(ident);
    }
    --i;
    tab = table[i];
  }
  return undefined;
};

const setIdent = (table: Symtable[], ident: string, value: any) => {
  if (table.length == 0) {
    return undefined;
  }
  let tab = table[table.length - 1];
  if (tab.has(ident)) {
    tab.set(ident, value);
    return true;
  }
  return false;
};

const initIdent = (table: Symtable[], ident: string, value: any): boolean => {
  let tab = table[table.length - 1];
  if (getIdent(table, ident) == undefined) {
    return false;
  }
  tab.set(ident, value);
  return true;
};

function enterScope(table: Symtable[]): void {
  table.push(new Map());
}

function exitScope(table: Symtable[]): void {
  table.pop();
}

const execute = (
  tokens: (Token | Token[])[],
  symtables: Symtable[],
): (Token | Error)[] => {
  const acc = [];
  const firstBlock = tokens;

  if (firstBlock == undefined) {
    return [new Error(Errors.UNKNOWN)];
  }

  if (firstBlock[0] instanceof Array) {
    return [new Error(Errors.SYNTAXERROR)];
  }

  if (firstBlock[0].type == TokenType.DO) {
    const [ele, ...rest] = firstBlock;
    for (const block of rest) {
      acc.push(executeAux(block, symtables));
    }
  } else if (firstBlock[0].type == TokenType.DEF) {
    const [_, ident, value] = firstBlock;
    if (ident instanceof Array) {
      return [new Error(Errors.SYNTAXERROR)];
    }

    if (symtables.length == 0) {
      symtables.push(new Map());
    }

    symtables[symtables.length - 1].set(
      ident.value,
      executeAux(value, symtables),
    );
  } else if (firstBlock[0].type == TokenType.FN) {
    const [_, ident, ...body] = firstBlock;
    if (symtables.length == 0) {
      symtables.push(new Map());
    }

    if (ident instanceof Array) {
      return [new Error(Errors.SYNTAXERROR)];
    }

    symtables[symtables.length - 1].set(
      ident.value,
      executeAux(body, symtables),
    );
  }
  return acc;
};

const i = new Interpreter();
i.eval("(do (+ 1 1))");

const j = new Interpreter();
const a = j.eval("(do (- 1 1))");
console.dir(a, { depth: null });

export { Interpreter, Errors, TokenType as Tokens };
