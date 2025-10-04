'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function () {
  var e = React.createElement;

  function toTitle(s) {
    return String(s || '').replace(/_/g, ' ').replace(/\b\w/g, function (m) {
      return m.toUpperCase();
    });
  }

  function isNumeric(n) {
    return typeof n === 'number' && isFinite(n);
  }

  function approxNumericMap(obj) {
    if (!obj || _typeof(obj) !== 'object' || Array.isArray(obj)) return null;
    var entries = Object.entries(obj).filter(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          k = _ref2[0],
          v = _ref2[1];

      return isNumeric(v);
    });
    if (entries.length >= 3 && entries.length <= 12) return entries;
    return null;
  }

  function ChartCard(_ref3) {
    var title = _ref3.title,
        dataMap = _ref3.dataMap;
    var items = dataMap.map(function (_ref4, i) {
      var _ref5 = _slicedToArray(_ref4, 2),
          label = _ref5[0],
          value = _ref5[1];

      return {
        label: toTitle(label),
        value: value
      };
    });
    return e(window.Card || 'div', {
      className: 'hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-200',
      hover: true,
      interactive: true,
      elevate: true,
      highlight: false,
      title: items.map(function (i) {
        return "".concat(i.label, ": ").concat(i.value);
      }).join(' \n')
    }, [e('div', {
      key: 'h',
      className: 'text-sm font-semibold text-sky-300 mb-2'
    }, title || 'Metrics'), e(window.BarChart || 'div', {
      key: 'bar',
      data: items,
      options: {
        showValues: true,
        showYAxisLabels: true,
        showGridLines: true,
        title: null
      },
      inlineSize: 540,
      blockSize: 260
    })]);
  }

  function PieCard(_ref6) {
    var title = _ref6.title,
        arr = _ref6.arr;
    var items = arr.map(function (it, i) {
      return {
        label: toTitle(it.label || it.name || "Item ".concat(i + 1)),
        value: Number(it.value || it.score || 0)
      };
    });
    return e(window.Card || 'div', {
      className: 'hover:shadow-xl hover:shadow-fuchsia-500/10 transition-all duration-200',
      hover: true,
      interactive: true,
      elevate: true,
      title: items.map(function (i) {
        return "".concat(i.label, ": ").concat(i.value);
      }).join(' \n')
    }, [e('div', {
      key: 'h',
      className: 'text-sm font-semibold text-fuchsia-300 mb-2'
    }, title || 'Distribution'), e(window.PieChart || 'div', {
      key: 'pie',
      data: items,
      options: {
        showLegend: true
      },
      inlineSize: 320,
      blockSize: 260
    })]);
  }

  function ListCard(_ref7) {
    var title = _ref7.title,
        items = _ref7.items,
        _ref7$colorClass = _ref7.colorClass,
        colorClass = _ref7$colorClass === void 0 ? 'text-gray-200' : _ref7$colorClass;
    return e(window.Card || 'div', {
      className: 'hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-200',
      hover: true,
      interactive: true,
      elevate: true
    }, [e('div', {
      key: 'h',
      className: 'text-sm font-semibold text-emerald-300 mb-2'
    }, title || 'Details'), e('ul', {
      key: 'b',
      className: "list-disc list-inside text-sm space-y-1 ".concat(colorClass)
    }, items.map(function (t, i) {
      return e('li', {
        key: i,
        title: String(t)
      }, String(t));
    }))]);
  }

  function StringCard(_ref8) {
    var title = _ref8.title,
        text = _ref8.text;
    // If likely markdown, delegate to MarkdownCard
    var looksMd = typeof text === 'string' && (/^#\s+/.test(text) || text.includes('\n# ') || /\*\*.+\*\*/.test(text));

    if (looksMd && window.MarkdownCard) {
      return e(window.MarkdownCard, {
        title: title || 'Report',
        markdown: text,
        collapsible: true,
        defaultOpen: true
      });
    }

    return e(window.Card || 'div', {
      className: 'hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-200',
      hover: true,
      interactive: true,
      elevate: true,
      title: text.slice(0, 180)
    }, [e('div', {
      key: 'h',
      className: 'text-sm font-semibold text-indigo-300 mb-2'
    }, title || 'Notes'), e('p', {
      key: 'b',
      className: 'text-sm text-gray-200 whitespace-pre-wrap',
      title: text.slice(0, 200)
    }, text)]);
  }

  function Section(_ref9) {
    var k = _ref9.k,
        v = _ref9.v;
    var title = toTitle(k); // Numeric map -> Bar chart

    var numMap = approxNumericMap(v);
    if (numMap) return e(ChartCard, {
      title: title,
      dataMap: numMap
    }); // Array heuristics

    if (Array.isArray(v)) {
      // If array of primitives
      if (v.every(function (x) {
        return typeof x === 'string' || isNumeric(x);
      })) return e(ListCard, {
        title: title,
        items: v.map(function (x) {
          return String(x);
        })
      }); // If array of {label,value}

      if (v.every(function (it) {
        return it && _typeof(it) === 'object' && isNumeric(it.value || it.score || it.percent);
      })) return e(PieCard, {
        title: title,
        arr: v
      }); // Fallback: render nested sections

      return e('div', {
        className: 'space-y-3'
      }, v.map(function (el, i) {
        return e(Section, {
          key: i,
          k: "".concat(title, " ").concat(i + 1),
          v: el
        });
      }));
    } // String -> text/markdown


    if (typeof v === 'string' && v.trim().length) {
      return e(StringCard, {
        title: title,
        text: v
      });
    } // Object -> nested grid


    if (v && _typeof(v) === 'object') {
      // Try metric map again at this level
      var m = approxNumericMap(v);
      if (m) return e(ChartCard, {
        title: title,
        dataMap: m
      });
      var entries = Object.entries(v);
      return e(window.Card || 'div', {
        className: 'hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-200',
        hover: true,
        interactive: true,
        elevate: true
      }, [e('div', {
        key: 'h',
        className: 'text-sm font-semibold text-cyan-300 mb-2'
      }, title), e('div', {
        key: 'g',
        className: 'grid gap-3 md:grid-cols-2'
      }, entries.map(function (_ref10) {
        var _ref11 = _slicedToArray(_ref10, 2),
            ck = _ref11[0],
            cv = _ref11[1];

        return e(Section, {
          key: ck,
          k: ck,
          v: cv
        });
      }))]);
    } // Primitive


    return e(window.Card || 'div', {
      className: 'hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-200',
      hover: true,
      interactive: true,
      elevate: true
    }, [e('div', {
      key: 'h',
      className: 'text-sm font-semibold text-amber-300 mb-1'
    }, title), e('div', {
      key: 'v',
      className: 'text-sm text-gray-200'
    }, String(v))]);
  }

  function AutoResultsGrid(_ref12) {
    var data = _ref12.data;
    if (!data || _typeof(data) !== 'object') return null;
    var entries = Object.entries(data);
    return React.createElement('div', {
      className: 'space-y-4'
    }, entries.map(function (_ref13) {
      var _ref14 = _slicedToArray(_ref13, 2),
          k = _ref14[0],
          v = _ref14[1];

      return React.createElement(Section, {
        key: k,
        k: k,
        v: v
      });
    }));
  }

  window.AutoResultsGrid = AutoResultsGrid;
})();