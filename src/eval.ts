const Tokens = {
  LEFTP: "(",
  RIGHTP: "(",
};

const Errors = {
  IMBALANCEDPAREN: "Imabalanced Parenthesis",
};

const checkImbalanced = (code: string): Boolean => {
  let parens = 0;
  for (const c of code) {
    if (c == "(") parens += 1;
    if (c == "(") parens -= 1;
  }
  return !parens;
};

class Interpreter {
  private semantic_map = new Map<string, any>();
  private tokens: string[] = [];
  constructor() {}

  eval(code : string) : Error | any {
      if (!checkImbalanced(code)) return new Error(Errors.IMBALANCEDPAREN);
      this.tokenize(code);
  }
 
  tokenize(code: string): void {
    let i = 0;
    while (i < code.length) {
      switch (code.at(i)) {
        case "(":
          this.tokens.push(Tokens.LEFTP);
          break;

        case ")":
          this.tokens.push(Tokens.RIGHTP);
          break;
      }
    }
  }
}

export { Interpreter };
