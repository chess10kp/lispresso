"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokens = exports.Errors = exports.Interpreter = void 0;
var TokenType = {
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
exports.Tokens = TokenType;
var keyWords = new Set([
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
var Errors = {
    IMBALANCEDPAREN: "Imabalanced Parenthesis",
    MISMATCHEDTYPE: "Mismatched Type",
    MISMATCHEDPAREN: "Mismatched Parenthesis",
    SYNTAXERROR: "Syntax Error",
    UNKNOWN: "Unknown Error",
    UNKNOWNVARIABLE: "Unknown Variable",
    DIVBYZERO: "Division by Zero",
    NAN: "NAN",
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
        this.identifiedTokens = [];
        this.tokens = [];
        this.table = [];
    }
    Interpreter.prototype.eval = function (code) {
        this.semantic_map.clear();
        this.nestedExpressions = [];
        this.tokens = [];
        this.table = [];
        if (!checkImbalanced(code))
            return [new Error(Errors.IMBALANCEDPAREN)];
        this.tokenize(code);
        this.nest();
        return this.execute();
    };
    Interpreter.prototype.execute = function () {
        var value = execute(this.nestedExpressions, this.table);
        return value;
    };
    Interpreter.prototype.printTokens = function () {
        return this;
    };
    Interpreter.prototype.getTokens = function () {
        return this.tokens;
    };
    Interpreter.prototype.getNested = function () {
        return this.nestedExpressions;
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
                    else {
                        this.tokens.push({ type: TokenType.GT, value: ">" });
                        i++;
                    }
                    break;
                case "<":
                    if (code.at(i + 1) == "=") {
                        this.tokens.push({ type: TokenType.LTE, value: "<=" });
                        i += 2;
                    }
                    else {
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
                    for (var j_1 = i; j_1 < code.length; j_1++) {
                        if (code.at(j_1) == " " ||
                            code.at(j_1) == "\n" ||
                            code.at(j_1) == ")" ||
                            code.at(j_1) == "(") {
                            var ident = code.slice(i, j_1).toUpperCase();
                            // @ts-ignore
                            var keyword = 
                            // @ts-ignore
                            TokenType[ident] ||
                                (isNaN(parseInt(ident))
                                    ? TokenType.IDENTIFIER
                                    : TokenType.NUMBER);
                            this.tokens.push({
                                type: keyword,
                                value: code.slice(i, j_1),
                            });
                            i = j_1;
                            break;
                        }
                    }
            }
        }
    };
    Interpreter.prototype.nest = function () {
        this.nestedExpressions = nest(this.tokens);
        if (this.nestedExpressions[0] instanceof Array) {
            // @ts-ignore
            this.nestedExpressions = this.nestedExpressions[0];
        }
        return this;
    };
    return Interpreter;
}());
exports.Interpreter = Interpreter;
// first arg returns remaining tokens, the second returns all the tokens under the current nesting
var nestAux = function (tokens, res) {
    // return [[], []]
    if (res === void 0) { res = []; }
    var current = tokens[0], tok = tokens.slice(1);
    if (current === undefined) {
        return [tok, res];
    }
    if (current.type == TokenType.LEFTP) {
        var _a = nestAux(tok), remaining = _a[0], nested = _a[1];
        // @ts-ignore
        return nestAux(remaining, __spreadArray(__spreadArray([], res, true), [nested], false));
    }
    else if (current.type == TokenType.RIGHTP) {
        return [tok, res];
    }
    else {
        // @ts-ignore
        return nestAux(tok, __spreadArray(__spreadArray([], res, true), [current], false));
    }
};
var nest = function (tokens) {
    return nestAux(tokens, [])[1];
};
var add = function (block, symtables) {
    var _ = block[0], rest = block.slice(1);
    // @ts-ignore
    var res = rest.reduce(function (acc, curr) {
        var a = executeAux(curr, symtables);
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
var sub = function (block, symtables) {
    var _ = block[0], rest = block.slice(1);
    // @ts-ignore
    var res = rest.reduce(function (acc, curr) {
        var a = executeAux(curr, symtables);
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
var mul = function (block, symtables) {
    var _ = block[0], rest = block.slice(1);
    // @ts-ignore
    var res = rest.reduce(function (acc, curr) {
        var a = executeAux(curr, symtables);
        if (a instanceof Error) {
            return a;
        }
        var tail = parseInt(a.value);
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
var div = function (block, symtables) {
    var _ = block[0], rest = block.slice(1);
    // @ts-ignore
    var res = rest.reduce(function (acc, curr) {
        var a = executeAux(curr, symtables);
        if (a instanceof Error) {
            return a;
        }
        var tail = parseInt(a.value);
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
var executeAux = function (block, symtables) {
    if (block instanceof Array && !(block[0] instanceof Array)) {
        switch (block[0].type) {
            case TokenType.DO:
                var ele = block[0], rest = block.slice(1);
                for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
                    var block_1 = rest_1[_i];
                    executeAux(block_1, symtables);
                }
                break;
            case TokenType.LET:
                var _ = block[0], ident = block[1], value = block[2];
                if (ident instanceof Array) {
                    return new Error(Errors.SYNTAXERROR);
                }
                if (symtables.length == 0) {
                    symtables.push(new Map());
                }
                symtables[symtables.length - 1].set(ident.value, executeAux(value, symtables));
                break;
            case TokenType.IF:
                var __ = block[0], ifCondition = block[1], ifBlock = block[2], elseBlock = block[3];
                var cond = executeAux(ifCondition, symtables);
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
                var sym = block[0], a = block[1], b_1 = block[2];
                var aVal = executeAux(a, symtables);
                var bVal = executeAux(b_1, symtables);
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
                var res = add(block, symtables);
                if (res instanceof Error) {
                    return res;
                }
                return { type: TokenType.NUMBER, value: res.toString() };
            case TokenType.SUB:
                var subRes = sub(block, symtables);
                if (subRes instanceof Error) {
                    return subRes;
                }
                return { type: TokenType.NUMBER, value: subRes.toString() };
            case TokenType.MUL:
                var mulRes = mul(block, symtables);
                if (mulRes instanceof Error) {
                    return mulRes;
                }
                return { type: TokenType.NUMBER, value: mulRes.toString() };
            case TokenType.DIV:
                var divRes = div(block, symtables);
                if (divRes instanceof Error) {
                    return divRes;
                }
                return { type: TokenType.NUMBER, value: divRes.toString() };
            case TokenType.DEF:
                if (block.length != 4) {
                    return new Error(Errors.SYNTAXERROR);
                }
                var defkwd = block[0], fnIdent = block[1], params = block[2], functionBlock = block[3];
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
    }
    else if (!(block instanceof Array)) {
        if (block.type == TokenType.IDENTIFIER) {
            var value = getIdent(symtables, block.value);
            if (value === undefined) {
                return new Error(Errors.UNKNOWNVARIABLE);
            }
            return value;
        }
        else if (block.type == TokenType.NUMBER) {
            var value = parseInt(block.value);
            if (isNaN(value)) {
                return new Error(Errors.NAN);
            }
            return block;
        }
    }
    return { type: "", value: "" };
};
var getIdent = function (table, ident) {
    if (table.length == 0) {
        return undefined;
    }
    var i = table.length - 1;
    var tab = table[i];
    while (tab) {
        if (tab.has(ident)) {
            return tab.get(ident);
        }
        --i;
        tab = table[i];
    }
    return undefined;
};
var setIdent = function (table, ident, value) {
    if (table.length == 0) {
        return undefined;
    }
    var tab = table[table.length - 1];
    if (tab.has(ident)) {
        tab.set(ident, value);
        return true;
    }
    return false;
};
var initIdent = function (table, ident, value) {
    var tab = table[table.length - 1];
    if (getIdent(table, ident) == undefined) {
        return false;
    }
    tab.set(ident, value);
    return true;
};
function enterScope(table) {
    table.push(new Map());
}
function exitScope(table) {
    table.pop();
}
var execute = function (tokens, symtables) {
    var acc = [];
    var firstBlock = tokens;
    if (firstBlock == undefined) {
        return [new Error(Errors.UNKNOWN)];
    }
    if (firstBlock[0] instanceof Array) {
        return [new Error(Errors.SYNTAXERROR)];
    }
    switch (firstBlock[0].type) {
        case TokenType.DO:
            var ele = firstBlock[0], rest = firstBlock.slice(1);
            for (var _i = 0, rest_2 = rest; _i < rest_2.length; _i++) {
                var block = rest_2[_i];
                acc.push(executeAux(block, symtables));
            }
            break;
        case TokenType.IF:
            var __ = firstBlock[0], ifCondition = firstBlock[1], ifBlock = firstBlock[2], elseBlock = firstBlock[3];
            var cond = executeAux(ifCondition, symtables);
            if (cond instanceof Error) {
                return [cond];
            }
            if (cond.value == "true") {
                acc.push(executeAux(ifBlock, symtables));
            }
            else {
                acc.push(executeAux(elseBlock, symtables));
            }
            break;
        case TokenType.DEF:
            if (firstBlock.length != 4) {
                return [new Error(Errors.SYNTAXERROR)];
            }
            var defkwd = firstBlock[0], fnIdent = firstBlock[1], params = firstBlock[2], functionBlock = firstBlock[3];
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
var j = new Interpreter();
var b = j.eval("(do (+ 1 1))");
console.log(b);
