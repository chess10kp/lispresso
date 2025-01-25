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
