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
  ELSE: "else",
  LAMBDA: "lambda",
  LET: "let",
  IF: "if",
};


const keyWords = new Set([
  "and",
  "do",
  "or",
  "if",
  "else",
  "not",
  "lambda",
  "let",
]);

const Errors = {
  IMBALANCEDPAREN: "Imabalanced Parenthesis",
  MISMATCHEDTYPE: "Mismatched Type",
  MISMATCHEDPAREN: "Mismatched Parenthesis",
  UNKNOWN: "Unknown Error",
};

type Token = {
  type: string | undefined;
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
  constructor() {}

  eval(code: string): Error | any {
    if (!checkImbalanced(code)) return new Error(Errors.IMBALANCEDPAREN);
    this.tokenize(code);
    this.nest();
    this.identify();
    return this;
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

              const ident = this.tokens.slice(i, j);
              // @ts-ignore
              const keyword = keyWords.has(ident) ? ident.toUpperCase() as keyof typeof TokenType : TokenType.IDENTIFIER;

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

  identify(): void {
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
    // check for keywords
    return nestAux(tok, [...res, current]);
  }
};

const nest = (tokens: Token[]): Token[][] => {
  return nestAux(tokens, [])[1];
};

const i = new Interpreter();
i.eval("(+ 1 (- 2 (* 3 (/ 1 a))))");

export { Interpreter, Errors, TokenType as Tokens };
