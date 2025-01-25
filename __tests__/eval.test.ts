const { Interpreter, Errors, Tokens } = require("../src/eval");

describe("Interpreter Class", () => {
  let interpreter: typeof Interpreter;

  beforeEach(() => {
    interpreter = new Interpreter();
  });

  test("imbalanced parenthesis should throw errors", () => {
    const code = "())";
    const result = interpreter.eval(code);
    expect(result).toBeInstanceOf(Error);
  });

  test("imbalanced parenthesis should also throw errors", () => {
    const code = "(()))";
    const result = interpreter.eval(code);
    expect(result).toBeInstanceOf(Error);
  });
});

describe("Tokenize Method", () => {
  let interpreter: typeof Interpreter;
  beforeEach(() => {
    interpreter = new Interpreter();
  });

  test("tokenize test 2", () => {
    const code = "(+ 1 (- 2 (* 3 (/ 1 100))))";
    const output = [
      { type: "(", value: "(" },
      { type: "+", value: "+" },
      { type: undefined, value: "1" },
      { type: "(", value: "(" },
      { type: "-", value: "-" },
      { type: undefined, value: "2" },
      { type: "(", value: "(" },
      { type: "*", value: "*" },
      { type: undefined, value: "3" },
      { type: "(", value: "(" },
      { type: "/", value: "/" },
      { type: undefined, value: "1" },
      { type: undefined, value: "100" },
      { type: ")", value: ")" },
      { type: ")", value: ")" },
      { type: ")", value: ")" },
      { type: ")", value: ")" },
    ];
    interpreter.tokenize(code)
    expect(interpreter.getTokens()).toEqual(output);
  });
});
