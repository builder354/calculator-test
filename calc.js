// Calculator logic. Pure functions, no DOM, so it can be tested on its own.
// Works like a desk calculator: each operator applies to the running total
// (2 + 3 × 4 = 20), and pressing = again repeats the last operation.

(function (root) {
  "use strict";

  var MAX_DIGITS = 12;
  var SYMBOLS = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  function initial() {
    return {
      entry: "0",        // digits being typed, as a string
      value: 0,          // number currently shown
      acc: null,         // running total waiting for the next number
      op: null,          // pending operator: "+", "-", "*", "/"
      typing: true,      // true while the user is typing a number
      done: false,       // true right after =
      last: null,        // { op, operand } for repeated =
      history: "",       // small line above the main number
      error: null
    };
  }

  // Round away binary floating-point noise (0.1 + 0.2 -> 0.3).
  function clean(n) {
    if (n === 0) return 0; // also turns -0 into 0
    return Number(n.toPrecision(15));
  }

  function compute(a, op, b) {
    var r;
    if (op === "+") r = a + b;
    else if (op === "-") r = a - b;
    else if (op === "*") r = a * b;
    else if (op === "/") {
      if (b === 0) return { error: "Can't divide by 0" };
      r = a / b;
    }
    r = clean(r);
    if (!isFinite(r) || Math.abs(r) >= 1e100) return { error: "Too big" };
    return { value: r };
  }

  var grouped = null;
  function format(n) {
    if (n === 0) return "0";
    var abs = Math.abs(n);
    if (abs >= 1e12 || abs < 1e-9) {
      // Scientific notation for very large or very small results.
      return n.toExponential(6).replace(/\.?0+e/, "e").replace("e+", "e");
    }
    if (!grouped) {
      try {
        grouped = new Intl.NumberFormat(undefined, { maximumSignificantDigits: 12 });
      } catch (e) {
        grouped = { format: function (x) { return String(Number(x.toPrecision(12))); } };
      }
    }
    return grouped.format(n);
  }

  function symbol(op) { return SYMBOLS[op] || ""; }

  function digit(s, d) {
    s = Object.assign({}, s);
    if (s.error) s = initial();
    if (s.done) {
      // A digit after = starts a new calculation.
      s = initial();
    }
    if (!s.typing) {
      s.entry = d;
      s.typing = true;
    } else if (s.entry === "0") {
      s.entry = d;
    } else if (s.entry.length < MAX_DIGITS) {
      s.entry += d;
    }
    s.value = Number(s.entry);
    return s;
  }

  function operator(s, op) {
    s = Object.assign({}, s);
    if (s.error) return s;
    if (s.op && s.typing) {
      // Chain: apply the pending operator before taking the new one.
      var r = compute(s.acc, s.op, s.value);
      if (r.error) return failed(s, r.error);
      s.value = r.value;
      s.acc = r.value;
    } else if (!s.op) {
      s.acc = s.value;
    }
    // If an operator was already pending and no number typed, just swap it.
    s.op = op;
    s.typing = false;
    s.done = false;
    s.history = format(s.acc) + " " + symbol(op);
    return s;
  }

  function equals(s) {
    s = Object.assign({}, s);
    if (s.error) return s;
    var a, op, b;
    if (s.op) {
      a = s.acc;
      op = s.op;
      b = s.typing ? s.value : s.acc; // "5 × =" squares, like most calculators
    } else if (s.done && s.last) {
      a = s.value;
      op = s.last.op;
      b = s.last.operand;
    } else {
      return s;
    }
    var r = compute(a, op, b);
    if (r.error) return failed(s, r.error);
    s.history = format(a) + " " + symbol(op) + " " + format(b) + " =";
    s.value = r.value;
    s.acc = null;
    s.op = null;
    s.last = { op: op, operand: b };
    s.typing = false;
    s.done = true;
    return s;
  }

  function failed(s, message) {
    var e = initial();
    e.error = message;
    e.history = s.history;
    return e;
  }

  function clear() { return initial(); }

  function display(s) { return s.error ? s.error : format(s.value); }

  var api = {
    initial: initial, digit: digit, operator: operator, equals: equals,
    clear: clear, display: display, format: format, symbol: symbol
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Calc = api;
})(this);
