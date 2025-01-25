"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokens = exports.Errors = exports.Interpreter = void 0;
var TokenType = {
    LEFTP: "(",
    RIGHTP: "(",
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
    IDENTIFIER: "",
    UNDEFINED: "",
};
exports.Tokens = TokenType;
var Errors = {
    IMBALANCEDPAREN: "Imabalanced Parenthesis",
    MISMATCHEDTYPE: "Mismatched Type",
    MISMATCHEDPAREN: "Mismatched Parenthesis",
};
exports.Errors = Errors;
var checkImbalanced = function (code) {
    var parens = 0;
    for (var _i = 0, code_1 = code; _i < code_1.length; _i++) {
        var c = code_1[_i];
        if (c == "(")
            parens += 1;
        if (c == ")")
            parens -= 1;
    }
    return !parens;
};
var Interpreter = /** @class */ (function () {
    function Interpreter() {
        this.semantic_map = new Map();
        this.nestedExpressions = [];
        this.tokens = [];
    }
    Interpreter.prototype.eval = function (code) {
        if (!checkImbalanced(code))
            return new Error(Errors.IMBALANCEDPAREN);
        this.tokenize(code);
    };
    Interpreter.prototype.printTokens = function () {
        for (var _i = 0, _a = this.tokens; _i < _a.length; _i++) {
            var token = _a[_i];
            console.log(token);
        }
    };
    Interpreter.prototype.tokenize = function (code) {
        var i = 0;
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
                    }
                    else {
                        this.tokens.push({ type: TokenType.ASSIGN, value: "=" });
                        i++;
                    }
                    break;
                case "\n":
                case " ":
                    i++;
                    break;
                default:
                    for (var j = i; j < code.length; j++) {
                        if (code.at(j) == " " ||
                            code.at(j) == "\n" ||
                            code.at(j) == ")" ||
                            code.at(j) == "(") {
                            this.tokens.push({
                                type: TokenType.UNDEFINED,
                                value: code.slice(i, j),
                            });
                            i = j;
                            break;
                        }
                    }
            }
        }
    };
    // convert tokens to nested expressions
    Interpreter.prototype.nest = function () {
        this.nestedExpressions = nest(this.tokens);
    };
    return Interpreter;
}());
exports.Interpreter = Interpreter;
var nest = function (tokens) {
    var nested = [];
    if (!tokens.length)
        return nested;
    for (var i_1 = 0; i_1 < tokens.length; i_1++) {
        if (tokens[0].type == TokenType.LEFTP) {
        }
    }
    return nested;
};
var i = new Interpreter();
i.eval("(+ 1 a)");
i.printTokens();
