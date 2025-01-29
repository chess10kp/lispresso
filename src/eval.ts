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
  EQ: "=",
  NEQ: "not =",
  AND: "and",
  OR: "or",
  NOT: "not",
  IDENTIFIER: "identifier",
  UNDEFINED: undefined,
  DO: "do",
  DEF: "def",
  ELSE: "else",
  LET: "let",
  IF: "if",
  NUMBER: "number",
  BOOLEAN: "boolean",
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
  DIVBYZERO: "Division by Zero",
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
    this.semantic_map.clear();
    this.nestedExpressions = [];
    this.tokens = [];
    this.table = [];
    if (!checkImbalanced(code)) return [new Error(Errors.IMBALANCEDPAREN)];
    this.tokenize(code);
    this.nest();
    return this.execute();
  }

  execute(): (Token | Error)[] {
    const value = execute(this.nestedExpressions, this.table);
    return value;
  }

  printTokens(): Interpreter {
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
          } else {
            this.tokens.push({ type: TokenType.GT, value: ">" });
            i++;
          }
          break;
        case "<":
          if (code.at(i + 1) == "=") {
            this.tokens.push({ type: TokenType.LTE, value: "<=" });
            i += 2;
          } else {
            this.tokens.push({ type: TokenType.LT, value: "<" });
            i++;
          }
          break;
        case "=":
          this.tokens.push({ type: TokenType.EQ, value: "=" });
          i++;
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

const add = (block: (Token | Token[])[], symtables: Symtable[]) => {
  const [_, ...rest] = block;
  // @ts-ignore
  const res = rest.reduce((acc, curr) => {
    const a = executeAux(curr, symtables);
    if (a instanceof Error) {
      return a;
    }
    return acc + parseInt(a.value);
  }, 0);
  if (res instanceof Array) {
    return new Error(Errors.UNKNOWN);
  }
  return res;
};

const sub = (block: (Token | Token[])[], symtables: Symtable[]) => {
  const [_, ...rest] = block;
  // @ts-ignore
  const res = rest.reduce((acc, curr) => {
    const a = executeAux(curr, symtables);
    if (a instanceof Error) {
      return a;
    }
    return acc - parseInt(a.value);
  }, 0);
  if (res instanceof Array) {
    return new Error(Errors.UNKNOWN);
  }
  return res;
};

const mul = (block: (Token | Token[])[], symtables: Symtable[]) => {
  const [_, ...rest] = block;
  // @ts-ignore
  const res = rest.reduce((acc, curr) => {
    const a = executeAux(curr, symtables);
    if (a instanceof Error) {
      return a;
    }
    const tail = parseInt(a.value);
    if (tail == Infinity) {
      return new Error(Errors.DIVBYZERO);
    }
    return acc * parseInt(a.value);
  }, 1);
  if (res instanceof Array) {
    return new Error(Errors.UNKNOWN);
  }
  return res;
};

const div = (block: (Token | Token[])[], symtables: Symtable[]) => {
  const [_, ...rest] = block;
  // @ts-ignore
  const res = rest.reduce((acc, curr) => {
    const a = executeAux(curr, symtables);
    if (a instanceof Error) {
      return a;
    }
    const tail = parseInt(a.value);
    if (tail == 0) {
      return new Error(Errors.DIVBYZERO);
    }
    return acc / tail;
  }, 1);
  if (res instanceof Array) {
    return new Error(Errors.UNKNOWN);
  }
  return res;
};

const executeAux = (
  block: (Token | Token[])[] | Token,
  symtables: Symtable[],
): Token | Error => {
  if (block instanceof Array && !(block[0] instanceof Array)) {
    switch (block[0].type) {
      case TokenType.DO:
        const [ele, ...rest] = block;
        for (const block of rest) {
          executeAux(block, symtables);
        }
        break;

      case TokenType.LET:
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
        break;

      case TokenType.IF:
        const [__, ifCondition, ifBlock, elseBlock] = block;
        const cond = executeAux(ifCondition, symtables);
        if (cond instanceof Error) {
          return new Error(Errors.SYNTAXERROR);
        }
        if (cond.value == "true") {
          return executeAux(ifBlock, symtables);
        }
        return executeAux(elseBlock, symtables);

      case TokenType.GT:
      case TokenType.LT:
      case TokenType.GTE:
      case TokenType.LTE:
      case TokenType.EQ:
        if (block.length != 3) {
          return new Error(Errors.SYNTAXERROR);
        }

        const [sym, a, b] = block;

        const aVal = executeAux(a, symtables);
        const bVal = executeAux(b, symtables);

        if (aVal instanceof Error || bVal instanceof Error) {
          return aVal instanceof Error ? aVal : bVal;
        }

        if (sym.type == TokenType.GT)
          return {
            type: TokenType.BOOLEAN,
            value: (parseInt(aVal.value) > parseInt(bVal.value)).toString(),
          };
        else if (sym.type == TokenType.LT)
          return {
            type: TokenType.BOOLEAN,
            value: (parseInt(aVal.value) < parseInt(bVal.value)).toString(),
          };
        else if (sym.type == TokenType.GTE)
          return {
            type: TokenType.BOOLEAN,
            value: (parseInt(aVal.value) >= parseInt(bVal.value)).toString(),
          };
        else if (sym.type == TokenType.LTE)
          return {
            type: TokenType.BOOLEAN,
            value: (parseInt(aVal.value) <= parseInt(bVal.value)).toString(),
          };
        else if (sym.type == TokenType.EQ)
          return {
            type: TokenType.BOOLEAN,
            value: (parseInt(aVal.value) == parseInt(bVal.value)).toString(),
          };
        //
        break;

      case TokenType.ADD:
        const res = add(block, symtables);
        if (res instanceof Error) {
          return res;
        }
        return { type: TokenType.NUMBER, value: res.toString() };

      case TokenType.SUB:
        const subRes = sub(block, symtables);
        if (subRes instanceof Error) {
          return subRes;
        }
        return { type: TokenType.NUMBER, value: subRes.toString() };

      case TokenType.MUL:
        const mulRes = mul(block, symtables);
        if (mulRes instanceof Error) {
          return mulRes;
        }
        return { type: TokenType.NUMBER, value: mulRes.toString() };

      case TokenType.DIV:
        const divRes = div(block, symtables);
        if (divRes instanceof Error) {
          return divRes;
        }
        return { type: TokenType.NUMBER, value: divRes.toString() };


    case TokenType.DEF:
      if (block.length != 4) {
        return new Error(Errors.SYNTAXERROR);
      }

      const [defkwd, fnIdent, params, functionBlock] = block;

      if (fnIdent instanceof Array) {
        return new Error(Errors.SYNTAXERROR);
      }

      if (symtables.length == 0) {
        symtables.push(new Map());
      }

      symtables[symtables.length - 1].set(fnIdent.value, {
        params: params,
        block: functionBlock,
      });
      break;
      default:

      // NEXT: handle this case, get the function to be called and then call it
    }
  } else if (!(block instanceof Array)) {
    if (block.type == TokenType.IDENTIFIER) {
      const value = getIdent(symtables, block.value);
      if (value === undefined) {
        return new Error(Errors.UNKNOWNVARIABLE);
      }
      return value;
    } else if (block.type == TokenType.NUMBER) {
      const value = parseInt(block.value);
      if (isNaN(value)) {
        return new Error(Errors.NAN);
      }
      return block;
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

  switch (firstBlock[0].type) {
    case TokenType.DO:
      const [ele, ...rest] = firstBlock;
      for (const block of rest) {
        acc.push(executeAux(block, symtables));
      }

      break;

    case TokenType.IF:
      const [__, ifCondition, ifBlock, elseBlock] = firstBlock;
      const cond = executeAux(ifCondition, symtables);
      if (cond instanceof Error) {
        return [cond];
      }
      if (cond.value == "true") {
        acc.push(executeAux(ifBlock, symtables));
      } else {
        acc.push(executeAux(elseBlock, symtables));
      }
      break;

    case TokenType.DEF:
      if (firstBlock.length != 4) {
        return [new Error(Errors.SYNTAXERROR)];
      }

      const [defkwd, fnIdent, params, functionBlock] = firstBlock;

      if (fnIdent instanceof Array) {
        return [new Error(Errors.SYNTAXERROR)];
      }

      if (symtables.length == 0) {
        symtables.push(new Map());
      }

      symtables[symtables.length - 1].set(fnIdent.value, {
        params: params,
        block: functionBlock,
      });
      break;
  }

  return acc;
};

const j = new Interpreter()
const b = j.eval("(do (+ 1 1))");
console.log(b)

export { Interpreter, Errors, TokenType as Tokens };
