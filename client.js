/* vendored qrcode (browser, IIFE) */
var WBQR = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/qrcode/lib/can-promise.js
  var require_can_promise = __commonJS({
    "node_modules/qrcode/lib/can-promise.js"(exports, module) {
      module.exports = function() {
        return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
      };
    }
  });

  // node_modules/qrcode/lib/core/utils.js
  var require_utils = __commonJS({
    "node_modules/qrcode/lib/core/utils.js"(exports) {
      var toSJISFunction;
      var CODEWORDS_COUNT = [
        0,
        // Not used
        26,
        44,
        70,
        100,
        134,
        172,
        196,
        242,
        292,
        346,
        404,
        466,
        532,
        581,
        655,
        733,
        815,
        901,
        991,
        1085,
        1156,
        1258,
        1364,
        1474,
        1588,
        1706,
        1828,
        1921,
        2051,
        2185,
        2323,
        2465,
        2611,
        2761,
        2876,
        3034,
        3196,
        3362,
        3532,
        3706
      ];
      exports.getSymbolSize = function getSymbolSize(version) {
        if (!version) throw new Error('"version" cannot be null or undefined');
        if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
        return version * 4 + 17;
      };
      exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
        return CODEWORDS_COUNT[version];
      };
      exports.getBCHDigit = function(data) {
        let digit = 0;
        while (data !== 0) {
          digit++;
          data >>>= 1;
        }
        return digit;
      };
      exports.setToSJISFunction = function setToSJISFunction(f) {
        if (typeof f !== "function") {
          throw new Error('"toSJISFunc" is not a valid function.');
        }
        toSJISFunction = f;
      };
      exports.isKanjiModeEnabled = function() {
        return typeof toSJISFunction !== "undefined";
      };
      exports.toSJIS = function toSJIS(kanji) {
        return toSJISFunction(kanji);
      };
    }
  });

  // node_modules/qrcode/lib/core/error-correction-level.js
  var require_error_correction_level = __commonJS({
    "node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
      exports.L = { bit: 1 };
      exports.M = { bit: 0 };
      exports.Q = { bit: 3 };
      exports.H = { bit: 2 };
      function fromString(string) {
        if (typeof string !== "string") {
          throw new Error("Param is not a string");
        }
        const lcStr = string.toLowerCase();
        switch (lcStr) {
          case "l":
          case "low":
            return exports.L;
          case "m":
          case "medium":
            return exports.M;
          case "q":
          case "quartile":
            return exports.Q;
          case "h":
          case "high":
            return exports.H;
          default:
            throw new Error("Unknown EC Level: " + string);
        }
      }
      exports.isValid = function isValid(level) {
        return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
      };
      exports.from = function from(value, defaultValue) {
        if (exports.isValid(value)) {
          return value;
        }
        try {
          return fromString(value);
        } catch (e) {
          return defaultValue;
        }
      };
    }
  });

  // node_modules/qrcode/lib/core/bit-buffer.js
  var require_bit_buffer = __commonJS({
    "node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
      function BitBuffer() {
        this.buffer = [];
        this.length = 0;
      }
      BitBuffer.prototype = {
        get: function(index) {
          const bufIndex = Math.floor(index / 8);
          return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
        },
        put: function(num, length) {
          for (let i = 0; i < length; i++) {
            this.putBit((num >>> length - i - 1 & 1) === 1);
          }
        },
        getLengthInBits: function() {
          return this.length;
        },
        putBit: function(bit) {
          const bufIndex = Math.floor(this.length / 8);
          if (this.buffer.length <= bufIndex) {
            this.buffer.push(0);
          }
          if (bit) {
            this.buffer[bufIndex] |= 128 >>> this.length % 8;
          }
          this.length++;
        }
      };
      module.exports = BitBuffer;
    }
  });

  // node_modules/qrcode/lib/core/bit-matrix.js
  var require_bit_matrix = __commonJS({
    "node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
      function BitMatrix(size) {
        if (!size || size < 1) {
          throw new Error("BitMatrix size must be defined and greater than 0");
        }
        this.size = size;
        this.data = new Uint8Array(size * size);
        this.reservedBit = new Uint8Array(size * size);
      }
      BitMatrix.prototype.set = function(row, col, value, reserved) {
        const index = row * this.size + col;
        this.data[index] = value;
        if (reserved) this.reservedBit[index] = true;
      };
      BitMatrix.prototype.get = function(row, col) {
        return this.data[row * this.size + col];
      };
      BitMatrix.prototype.xor = function(row, col, value) {
        this.data[row * this.size + col] ^= value;
      };
      BitMatrix.prototype.isReserved = function(row, col) {
        return this.reservedBit[row * this.size + col];
      };
      module.exports = BitMatrix;
    }
  });

  // node_modules/qrcode/lib/core/alignment-pattern.js
  var require_alignment_pattern = __commonJS({
    "node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
      var getSymbolSize = require_utils().getSymbolSize;
      exports.getRowColCoords = function getRowColCoords(version) {
        if (version === 1) return [];
        const posCount = Math.floor(version / 7) + 2;
        const size = getSymbolSize(version);
        const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
        const positions = [size - 7];
        for (let i = 1; i < posCount - 1; i++) {
          positions[i] = positions[i - 1] - intervals;
        }
        positions.push(6);
        return positions.reverse();
      };
      exports.getPositions = function getPositions(version) {
        const coords = [];
        const pos = exports.getRowColCoords(version);
        const posLength = pos.length;
        for (let i = 0; i < posLength; i++) {
          for (let j = 0; j < posLength; j++) {
            if (i === 0 && j === 0 || // top-left
            i === 0 && j === posLength - 1 || // bottom-left
            i === posLength - 1 && j === 0) {
              continue;
            }
            coords.push([pos[i], pos[j]]);
          }
        }
        return coords;
      };
    }
  });

  // node_modules/qrcode/lib/core/finder-pattern.js
  var require_finder_pattern = __commonJS({
    "node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
      var getSymbolSize = require_utils().getSymbolSize;
      var FINDER_PATTERN_SIZE = 7;
      exports.getPositions = function getPositions(version) {
        const size = getSymbolSize(version);
        return [
          // top-left
          [0, 0],
          // top-right
          [size - FINDER_PATTERN_SIZE, 0],
          // bottom-left
          [0, size - FINDER_PATTERN_SIZE]
        ];
      };
    }
  });

  // node_modules/qrcode/lib/core/mask-pattern.js
  var require_mask_pattern = __commonJS({
    "node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
      exports.Patterns = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      };
      var PenaltyScores = {
        N1: 3,
        N2: 3,
        N3: 40,
        N4: 10
      };
      exports.isValid = function isValid(mask) {
        return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
      };
      exports.from = function from(value) {
        return exports.isValid(value) ? parseInt(value, 10) : void 0;
      };
      exports.getPenaltyN1 = function getPenaltyN1(data) {
        const size = data.size;
        let points = 0;
        let sameCountCol = 0;
        let sameCountRow = 0;
        let lastCol = null;
        let lastRow = null;
        for (let row = 0; row < size; row++) {
          sameCountCol = sameCountRow = 0;
          lastCol = lastRow = null;
          for (let col = 0; col < size; col++) {
            let module2 = data.get(row, col);
            if (module2 === lastCol) {
              sameCountCol++;
            } else {
              if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
              lastCol = module2;
              sameCountCol = 1;
            }
            module2 = data.get(col, row);
            if (module2 === lastRow) {
              sameCountRow++;
            } else {
              if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
              lastRow = module2;
              sameCountRow = 1;
            }
          }
          if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
          if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
        }
        return points;
      };
      exports.getPenaltyN2 = function getPenaltyN2(data) {
        const size = data.size;
        let points = 0;
        for (let row = 0; row < size - 1; row++) {
          for (let col = 0; col < size - 1; col++) {
            const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
            if (last === 4 || last === 0) points++;
          }
        }
        return points * PenaltyScores.N2;
      };
      exports.getPenaltyN3 = function getPenaltyN3(data) {
        const size = data.size;
        let points = 0;
        let bitsCol = 0;
        let bitsRow = 0;
        for (let row = 0; row < size; row++) {
          bitsCol = bitsRow = 0;
          for (let col = 0; col < size; col++) {
            bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
            if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
            bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
            if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
          }
        }
        return points * PenaltyScores.N3;
      };
      exports.getPenaltyN4 = function getPenaltyN4(data) {
        let darkCount = 0;
        const modulesCount = data.data.length;
        for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
        const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
        return k * PenaltyScores.N4;
      };
      function getMaskAt(maskPattern, i, j) {
        switch (maskPattern) {
          case exports.Patterns.PATTERN000:
            return (i + j) % 2 === 0;
          case exports.Patterns.PATTERN001:
            return i % 2 === 0;
          case exports.Patterns.PATTERN010:
            return j % 3 === 0;
          case exports.Patterns.PATTERN011:
            return (i + j) % 3 === 0;
          case exports.Patterns.PATTERN100:
            return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
          case exports.Patterns.PATTERN101:
            return i * j % 2 + i * j % 3 === 0;
          case exports.Patterns.PATTERN110:
            return (i * j % 2 + i * j % 3) % 2 === 0;
          case exports.Patterns.PATTERN111:
            return (i * j % 3 + (i + j) % 2) % 2 === 0;
          default:
            throw new Error("bad maskPattern:" + maskPattern);
        }
      }
      exports.applyMask = function applyMask(pattern, data) {
        const size = data.size;
        for (let col = 0; col < size; col++) {
          for (let row = 0; row < size; row++) {
            if (data.isReserved(row, col)) continue;
            data.xor(row, col, getMaskAt(pattern, row, col));
          }
        }
      };
      exports.getBestMask = function getBestMask(data, setupFormatFunc) {
        const numPatterns = Object.keys(exports.Patterns).length;
        let bestPattern = 0;
        let lowerPenalty = Infinity;
        for (let p = 0; p < numPatterns; p++) {
          setupFormatFunc(p);
          exports.applyMask(p, data);
          const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
          exports.applyMask(p, data);
          if (penalty < lowerPenalty) {
            lowerPenalty = penalty;
            bestPattern = p;
          }
        }
        return bestPattern;
      };
    }
  });

  // node_modules/qrcode/lib/core/error-correction-code.js
  var require_error_correction_code = __commonJS({
    "node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
      var ECLevel = require_error_correction_level();
      var EC_BLOCKS_TABLE = [
        // L  M  Q  H
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        1,
        2,
        2,
        4,
        1,
        2,
        4,
        4,
        2,
        4,
        4,
        4,
        2,
        4,
        6,
        5,
        2,
        4,
        6,
        6,
        2,
        5,
        8,
        8,
        4,
        5,
        8,
        8,
        4,
        5,
        8,
        11,
        4,
        8,
        10,
        11,
        4,
        9,
        12,
        16,
        4,
        9,
        16,
        16,
        6,
        10,
        12,
        18,
        6,
        10,
        17,
        16,
        6,
        11,
        16,
        19,
        6,
        13,
        18,
        21,
        7,
        14,
        21,
        25,
        8,
        16,
        20,
        25,
        8,
        17,
        23,
        25,
        9,
        17,
        23,
        34,
        9,
        18,
        25,
        30,
        10,
        20,
        27,
        32,
        12,
        21,
        29,
        35,
        12,
        23,
        34,
        37,
        12,
        25,
        34,
        40,
        13,
        26,
        35,
        42,
        14,
        28,
        38,
        45,
        15,
        29,
        40,
        48,
        16,
        31,
        43,
        51,
        17,
        33,
        45,
        54,
        18,
        35,
        48,
        57,
        19,
        37,
        51,
        60,
        19,
        38,
        53,
        63,
        20,
        40,
        56,
        66,
        21,
        43,
        59,
        70,
        22,
        45,
        62,
        74,
        24,
        47,
        65,
        77,
        25,
        49,
        68,
        81
      ];
      var EC_CODEWORDS_TABLE = [
        // L  M  Q  H
        7,
        10,
        13,
        17,
        10,
        16,
        22,
        28,
        15,
        26,
        36,
        44,
        20,
        36,
        52,
        64,
        26,
        48,
        72,
        88,
        36,
        64,
        96,
        112,
        40,
        72,
        108,
        130,
        48,
        88,
        132,
        156,
        60,
        110,
        160,
        192,
        72,
        130,
        192,
        224,
        80,
        150,
        224,
        264,
        96,
        176,
        260,
        308,
        104,
        198,
        288,
        352,
        120,
        216,
        320,
        384,
        132,
        240,
        360,
        432,
        144,
        280,
        408,
        480,
        168,
        308,
        448,
        532,
        180,
        338,
        504,
        588,
        196,
        364,
        546,
        650,
        224,
        416,
        600,
        700,
        224,
        442,
        644,
        750,
        252,
        476,
        690,
        816,
        270,
        504,
        750,
        900,
        300,
        560,
        810,
        960,
        312,
        588,
        870,
        1050,
        336,
        644,
        952,
        1110,
        360,
        700,
        1020,
        1200,
        390,
        728,
        1050,
        1260,
        420,
        784,
        1140,
        1350,
        450,
        812,
        1200,
        1440,
        480,
        868,
        1290,
        1530,
        510,
        924,
        1350,
        1620,
        540,
        980,
        1440,
        1710,
        570,
        1036,
        1530,
        1800,
        570,
        1064,
        1590,
        1890,
        600,
        1120,
        1680,
        1980,
        630,
        1204,
        1770,
        2100,
        660,
        1260,
        1860,
        2220,
        720,
        1316,
        1950,
        2310,
        750,
        1372,
        2040,
        2430
      ];
      exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
        switch (errorCorrectionLevel) {
          case ECLevel.L:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
          case ECLevel.M:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
          case ECLevel.Q:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
          case ECLevel.H:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
          default:
            return void 0;
        }
      };
      exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
        switch (errorCorrectionLevel) {
          case ECLevel.L:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
          case ECLevel.M:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
          case ECLevel.Q:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
          case ECLevel.H:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
          default:
            return void 0;
        }
      };
    }
  });

  // node_modules/qrcode/lib/core/galois-field.js
  var require_galois_field = __commonJS({
    "node_modules/qrcode/lib/core/galois-field.js"(exports) {
      var EXP_TABLE = new Uint8Array(512);
      var LOG_TABLE = new Uint8Array(256);
      (function initTables() {
        let x = 1;
        for (let i = 0; i < 255; i++) {
          EXP_TABLE[i] = x;
          LOG_TABLE[x] = i;
          x <<= 1;
          if (x & 256) {
            x ^= 285;
          }
        }
        for (let i = 255; i < 512; i++) {
          EXP_TABLE[i] = EXP_TABLE[i - 255];
        }
      })();
      exports.log = function log(n) {
        if (n < 1) throw new Error("log(" + n + ")");
        return LOG_TABLE[n];
      };
      exports.exp = function exp(n) {
        return EXP_TABLE[n];
      };
      exports.mul = function mul(x, y) {
        if (x === 0 || y === 0) return 0;
        return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
      };
    }
  });

  // node_modules/qrcode/lib/core/polynomial.js
  var require_polynomial = __commonJS({
    "node_modules/qrcode/lib/core/polynomial.js"(exports) {
      var GF = require_galois_field();
      exports.mul = function mul(p1, p2) {
        const coeff = new Uint8Array(p1.length + p2.length - 1);
        for (let i = 0; i < p1.length; i++) {
          for (let j = 0; j < p2.length; j++) {
            coeff[i + j] ^= GF.mul(p1[i], p2[j]);
          }
        }
        return coeff;
      };
      exports.mod = function mod(divident, divisor) {
        let result = new Uint8Array(divident);
        while (result.length - divisor.length >= 0) {
          const coeff = result[0];
          for (let i = 0; i < divisor.length; i++) {
            result[i] ^= GF.mul(divisor[i], coeff);
          }
          let offset = 0;
          while (offset < result.length && result[offset] === 0) offset++;
          result = result.slice(offset);
        }
        return result;
      };
      exports.generateECPolynomial = function generateECPolynomial(degree) {
        let poly = new Uint8Array([1]);
        for (let i = 0; i < degree; i++) {
          poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
        }
        return poly;
      };
    }
  });

  // node_modules/qrcode/lib/core/reed-solomon-encoder.js
  var require_reed_solomon_encoder = __commonJS({
    "node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
      var Polynomial = require_polynomial();
      function ReedSolomonEncoder(degree) {
        this.genPoly = void 0;
        this.degree = degree;
        if (this.degree) this.initialize(this.degree);
      }
      ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
        this.degree = degree;
        this.genPoly = Polynomial.generateECPolynomial(this.degree);
      };
      ReedSolomonEncoder.prototype.encode = function encode(data) {
        if (!this.genPoly) {
          throw new Error("Encoder not initialized");
        }
        const paddedData = new Uint8Array(data.length + this.degree);
        paddedData.set(data);
        const remainder = Polynomial.mod(paddedData, this.genPoly);
        const start = this.degree - remainder.length;
        if (start > 0) {
          const buff = new Uint8Array(this.degree);
          buff.set(remainder, start);
          return buff;
        }
        return remainder;
      };
      module.exports = ReedSolomonEncoder;
    }
  });

  // node_modules/qrcode/lib/core/version-check.js
  var require_version_check = __commonJS({
    "node_modules/qrcode/lib/core/version-check.js"(exports) {
      exports.isValid = function isValid(version) {
        return !isNaN(version) && version >= 1 && version <= 40;
      };
    }
  });

  // node_modules/qrcode/lib/core/regex.js
  var require_regex = __commonJS({
    "node_modules/qrcode/lib/core/regex.js"(exports) {
      var numeric = "[0-9]+";
      var alphanumeric = "[A-Z $%*+\\-./:]+";
      var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
      kanji = kanji.replace(/u/g, "\\u");
      var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
      exports.KANJI = new RegExp(kanji, "g");
      exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
      exports.BYTE = new RegExp(byte, "g");
      exports.NUMERIC = new RegExp(numeric, "g");
      exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
      var TEST_KANJI = new RegExp("^" + kanji + "$");
      var TEST_NUMERIC = new RegExp("^" + numeric + "$");
      var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
      exports.testKanji = function testKanji(str) {
        return TEST_KANJI.test(str);
      };
      exports.testNumeric = function testNumeric(str) {
        return TEST_NUMERIC.test(str);
      };
      exports.testAlphanumeric = function testAlphanumeric(str) {
        return TEST_ALPHANUMERIC.test(str);
      };
    }
  });

  // node_modules/qrcode/lib/core/mode.js
  var require_mode = __commonJS({
    "node_modules/qrcode/lib/core/mode.js"(exports) {
      var VersionCheck = require_version_check();
      var Regex = require_regex();
      exports.NUMERIC = {
        id: "Numeric",
        bit: 1 << 0,
        ccBits: [10, 12, 14]
      };
      exports.ALPHANUMERIC = {
        id: "Alphanumeric",
        bit: 1 << 1,
        ccBits: [9, 11, 13]
      };
      exports.BYTE = {
        id: "Byte",
        bit: 1 << 2,
        ccBits: [8, 16, 16]
      };
      exports.KANJI = {
        id: "Kanji",
        bit: 1 << 3,
        ccBits: [8, 10, 12]
      };
      exports.MIXED = {
        bit: -1
      };
      exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
        if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
        if (!VersionCheck.isValid(version)) {
          throw new Error("Invalid version: " + version);
        }
        if (version >= 1 && version < 10) return mode.ccBits[0];
        else if (version < 27) return mode.ccBits[1];
        return mode.ccBits[2];
      };
      exports.getBestModeForData = function getBestModeForData(dataStr) {
        if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
        else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
        else if (Regex.testKanji(dataStr)) return exports.KANJI;
        else return exports.BYTE;
      };
      exports.toString = function toString(mode) {
        if (mode && mode.id) return mode.id;
        throw new Error("Invalid mode");
      };
      exports.isValid = function isValid(mode) {
        return mode && mode.bit && mode.ccBits;
      };
      function fromString(string) {
        if (typeof string !== "string") {
          throw new Error("Param is not a string");
        }
        const lcStr = string.toLowerCase();
        switch (lcStr) {
          case "numeric":
            return exports.NUMERIC;
          case "alphanumeric":
            return exports.ALPHANUMERIC;
          case "kanji":
            return exports.KANJI;
          case "byte":
            return exports.BYTE;
          default:
            throw new Error("Unknown mode: " + string);
        }
      }
      exports.from = function from(value, defaultValue) {
        if (exports.isValid(value)) {
          return value;
        }
        try {
          return fromString(value);
        } catch (e) {
          return defaultValue;
        }
      };
    }
  });

  // node_modules/qrcode/lib/core/version.js
  var require_version = __commonJS({
    "node_modules/qrcode/lib/core/version.js"(exports) {
      var Utils = require_utils();
      var ECCode = require_error_correction_code();
      var ECLevel = require_error_correction_level();
      var Mode = require_mode();
      var VersionCheck = require_version_check();
      var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
      var G18_BCH = Utils.getBCHDigit(G18);
      function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
        for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
          if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
            return currentVersion;
          }
        }
        return void 0;
      }
      function getReservedBitsCount(mode, version) {
        return Mode.getCharCountIndicator(mode, version) + 4;
      }
      function getTotalBitsFromDataArray(segments, version) {
        let totalBits = 0;
        segments.forEach(function(data) {
          const reservedBits = getReservedBitsCount(data.mode, version);
          totalBits += reservedBits + data.getBitsLength();
        });
        return totalBits;
      }
      function getBestVersionForMixedData(segments, errorCorrectionLevel) {
        for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
          const length = getTotalBitsFromDataArray(segments, currentVersion);
          if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
            return currentVersion;
          }
        }
        return void 0;
      }
      exports.from = function from(value, defaultValue) {
        if (VersionCheck.isValid(value)) {
          return parseInt(value, 10);
        }
        return defaultValue;
      };
      exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
        if (!VersionCheck.isValid(version)) {
          throw new Error("Invalid QR Code version");
        }
        if (typeof mode === "undefined") mode = Mode.BYTE;
        const totalCodewords = Utils.getSymbolTotalCodewords(version);
        const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
        const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
        if (mode === Mode.MIXED) return dataTotalCodewordsBits;
        const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
        switch (mode) {
          case Mode.NUMERIC:
            return Math.floor(usableBits / 10 * 3);
          case Mode.ALPHANUMERIC:
            return Math.floor(usableBits / 11 * 2);
          case Mode.KANJI:
            return Math.floor(usableBits / 13);
          case Mode.BYTE:
          default:
            return Math.floor(usableBits / 8);
        }
      };
      exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
        let seg;
        const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
        if (Array.isArray(data)) {
          if (data.length > 1) {
            return getBestVersionForMixedData(data, ecl);
          }
          if (data.length === 0) {
            return 1;
          }
          seg = data[0];
        } else {
          seg = data;
        }
        return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
      };
      exports.getEncodedBits = function getEncodedBits(version) {
        if (!VersionCheck.isValid(version) || version < 7) {
          throw new Error("Invalid QR Code version");
        }
        let d = version << 12;
        while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
          d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
        }
        return version << 12 | d;
      };
    }
  });

  // node_modules/qrcode/lib/core/format-info.js
  var require_format_info = __commonJS({
    "node_modules/qrcode/lib/core/format-info.js"(exports) {
      var Utils = require_utils();
      var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
      var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
      var G15_BCH = Utils.getBCHDigit(G15);
      exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
        const data = errorCorrectionLevel.bit << 3 | mask;
        let d = data << 10;
        while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
          d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
        }
        return (data << 10 | d) ^ G15_MASK;
      };
    }
  });

  // node_modules/qrcode/lib/core/numeric-data.js
  var require_numeric_data = __commonJS({
    "node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
      var Mode = require_mode();
      function NumericData(data) {
        this.mode = Mode.NUMERIC;
        this.data = data.toString();
      }
      NumericData.getBitsLength = function getBitsLength(length) {
        return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
      };
      NumericData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      NumericData.prototype.getBitsLength = function getBitsLength() {
        return NumericData.getBitsLength(this.data.length);
      };
      NumericData.prototype.write = function write(bitBuffer) {
        let i, group, value;
        for (i = 0; i + 3 <= this.data.length; i += 3) {
          group = this.data.substr(i, 3);
          value = parseInt(group, 10);
          bitBuffer.put(value, 10);
        }
        const remainingNum = this.data.length - i;
        if (remainingNum > 0) {
          group = this.data.substr(i);
          value = parseInt(group, 10);
          bitBuffer.put(value, remainingNum * 3 + 1);
        }
      };
      module.exports = NumericData;
    }
  });

  // node_modules/qrcode/lib/core/alphanumeric-data.js
  var require_alphanumeric_data = __commonJS({
    "node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
      var Mode = require_mode();
      var ALPHA_NUM_CHARS = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        " ",
        "$",
        "%",
        "*",
        "+",
        "-",
        ".",
        "/",
        ":"
      ];
      function AlphanumericData(data) {
        this.mode = Mode.ALPHANUMERIC;
        this.data = data;
      }
      AlphanumericData.getBitsLength = function getBitsLength(length) {
        return 11 * Math.floor(length / 2) + 6 * (length % 2);
      };
      AlphanumericData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      AlphanumericData.prototype.getBitsLength = function getBitsLength() {
        return AlphanumericData.getBitsLength(this.data.length);
      };
      AlphanumericData.prototype.write = function write(bitBuffer) {
        let i;
        for (i = 0; i + 2 <= this.data.length; i += 2) {
          let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
          value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
          bitBuffer.put(value, 11);
        }
        if (this.data.length % 2) {
          bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
        }
      };
      module.exports = AlphanumericData;
    }
  });

  // node_modules/qrcode/lib/core/byte-data.js
  var require_byte_data = __commonJS({
    "node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
      var Mode = require_mode();
      function ByteData(data) {
        this.mode = Mode.BYTE;
        if (typeof data === "string") {
          this.data = new TextEncoder().encode(data);
        } else {
          this.data = new Uint8Array(data);
        }
      }
      ByteData.getBitsLength = function getBitsLength(length) {
        return length * 8;
      };
      ByteData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      ByteData.prototype.getBitsLength = function getBitsLength() {
        return ByteData.getBitsLength(this.data.length);
      };
      ByteData.prototype.write = function(bitBuffer) {
        for (let i = 0, l = this.data.length; i < l; i++) {
          bitBuffer.put(this.data[i], 8);
        }
      };
      module.exports = ByteData;
    }
  });

  // node_modules/qrcode/lib/core/kanji-data.js
  var require_kanji_data = __commonJS({
    "node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
      var Mode = require_mode();
      var Utils = require_utils();
      function KanjiData(data) {
        this.mode = Mode.KANJI;
        this.data = data;
      }
      KanjiData.getBitsLength = function getBitsLength(length) {
        return length * 13;
      };
      KanjiData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      KanjiData.prototype.getBitsLength = function getBitsLength() {
        return KanjiData.getBitsLength(this.data.length);
      };
      KanjiData.prototype.write = function(bitBuffer) {
        let i;
        for (i = 0; i < this.data.length; i++) {
          let value = Utils.toSJIS(this.data[i]);
          if (value >= 33088 && value <= 40956) {
            value -= 33088;
          } else if (value >= 57408 && value <= 60351) {
            value -= 49472;
          } else {
            throw new Error(
              "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
            );
          }
          value = (value >>> 8 & 255) * 192 + (value & 255);
          bitBuffer.put(value, 13);
        }
      };
      module.exports = KanjiData;
    }
  });

  // node_modules/dijkstrajs/dijkstra.js
  var require_dijkstra = __commonJS({
    "node_modules/dijkstrajs/dijkstra.js"(exports, module) {
      "use strict";
      var dijkstra = {
        single_source_shortest_paths: function(graph, s, d) {
          var predecessors = {};
          var costs = {};
          costs[s] = 0;
          var open = dijkstra.PriorityQueue.make();
          open.push(s, 0);
          var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
          while (!open.empty()) {
            closest = open.pop();
            u = closest.value;
            cost_of_s_to_u = closest.cost;
            adjacent_nodes = graph[u] || {};
            for (v in adjacent_nodes) {
              if (adjacent_nodes.hasOwnProperty(v)) {
                cost_of_e = adjacent_nodes[v];
                cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
                cost_of_s_to_v = costs[v];
                first_visit = typeof costs[v] === "undefined";
                if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                  costs[v] = cost_of_s_to_u_plus_cost_of_e;
                  open.push(v, cost_of_s_to_u_plus_cost_of_e);
                  predecessors[v] = u;
                }
              }
            }
          }
          if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
            var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
            throw new Error(msg);
          }
          return predecessors;
        },
        extract_shortest_path_from_predecessor_list: function(predecessors, d) {
          var nodes = [];
          var u = d;
          var predecessor;
          while (u) {
            nodes.push(u);
            predecessor = predecessors[u];
            u = predecessors[u];
          }
          nodes.reverse();
          return nodes;
        },
        find_path: function(graph, s, d) {
          var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
          return dijkstra.extract_shortest_path_from_predecessor_list(
            predecessors,
            d
          );
        },
        /**
         * A very naive priority queue implementation.
         */
        PriorityQueue: {
          make: function(opts) {
            var T = dijkstra.PriorityQueue, t = {}, key;
            opts = opts || {};
            for (key in T) {
              if (T.hasOwnProperty(key)) {
                t[key] = T[key];
              }
            }
            t.queue = [];
            t.sorter = opts.sorter || T.default_sorter;
            return t;
          },
          default_sorter: function(a, b) {
            return a.cost - b.cost;
          },
          /**
           * Add a new item to the queue and ensure the highest priority element
           * is at the front of the queue.
           */
          push: function(value, cost) {
            var item = { value, cost };
            this.queue.push(item);
            this.queue.sort(this.sorter);
          },
          /**
           * Return the highest priority element in the queue.
           */
          pop: function() {
            return this.queue.shift();
          },
          empty: function() {
            return this.queue.length === 0;
          }
        }
      };
      if (typeof module !== "undefined") {
        module.exports = dijkstra;
      }
    }
  });

  // node_modules/qrcode/lib/core/segments.js
  var require_segments = __commonJS({
    "node_modules/qrcode/lib/core/segments.js"(exports) {
      var Mode = require_mode();
      var NumericData = require_numeric_data();
      var AlphanumericData = require_alphanumeric_data();
      var ByteData = require_byte_data();
      var KanjiData = require_kanji_data();
      var Regex = require_regex();
      var Utils = require_utils();
      var dijkstra = require_dijkstra();
      function getStringByteLength(str) {
        return unescape(encodeURIComponent(str)).length;
      }
      function getSegments(regex, mode, str) {
        const segments = [];
        let result;
        while ((result = regex.exec(str)) !== null) {
          segments.push({
            data: result[0],
            index: result.index,
            mode,
            length: result[0].length
          });
        }
        return segments;
      }
      function getSegmentsFromString(dataStr) {
        const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
        const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
        let byteSegs;
        let kanjiSegs;
        if (Utils.isKanjiModeEnabled()) {
          byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
          kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
        } else {
          byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
          kanjiSegs = [];
        }
        const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
        return segs.sort(function(s1, s2) {
          return s1.index - s2.index;
        }).map(function(obj) {
          return {
            data: obj.data,
            mode: obj.mode,
            length: obj.length
          };
        });
      }
      function getSegmentBitsLength(length, mode) {
        switch (mode) {
          case Mode.NUMERIC:
            return NumericData.getBitsLength(length);
          case Mode.ALPHANUMERIC:
            return AlphanumericData.getBitsLength(length);
          case Mode.KANJI:
            return KanjiData.getBitsLength(length);
          case Mode.BYTE:
            return ByteData.getBitsLength(length);
        }
      }
      function mergeSegments(segs) {
        return segs.reduce(function(acc, curr) {
          const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
          if (prevSeg && prevSeg.mode === curr.mode) {
            acc[acc.length - 1].data += curr.data;
            return acc;
          }
          acc.push(curr);
          return acc;
        }, []);
      }
      function buildNodes(segs) {
        const nodes = [];
        for (let i = 0; i < segs.length; i++) {
          const seg = segs[i];
          switch (seg.mode) {
            case Mode.NUMERIC:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
                { data: seg.data, mode: Mode.BYTE, length: seg.length }
              ]);
              break;
            case Mode.ALPHANUMERIC:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.BYTE, length: seg.length }
              ]);
              break;
            case Mode.KANJI:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
              ]);
              break;
            case Mode.BYTE:
              nodes.push([
                { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
              ]);
          }
        }
        return nodes;
      }
      function buildGraph(nodes, version) {
        const table = {};
        const graph = { start: {} };
        let prevNodeIds = ["start"];
        for (let i = 0; i < nodes.length; i++) {
          const nodeGroup = nodes[i];
          const currentNodeIds = [];
          for (let j = 0; j < nodeGroup.length; j++) {
            const node = nodeGroup[j];
            const key = "" + i + j;
            currentNodeIds.push(key);
            table[key] = { node, lastCount: 0 };
            graph[key] = {};
            for (let n = 0; n < prevNodeIds.length; n++) {
              const prevNodeId = prevNodeIds[n];
              if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
                graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
                table[prevNodeId].lastCount += node.length;
              } else {
                if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
                graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
              }
            }
          }
          prevNodeIds = currentNodeIds;
        }
        for (let n = 0; n < prevNodeIds.length; n++) {
          graph[prevNodeIds[n]].end = 0;
        }
        return { map: graph, table };
      }
      function buildSingleSegment(data, modesHint) {
        let mode;
        const bestMode = Mode.getBestModeForData(data);
        mode = Mode.from(modesHint, bestMode);
        if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
          throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
        }
        if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
          mode = Mode.BYTE;
        }
        switch (mode) {
          case Mode.NUMERIC:
            return new NumericData(data);
          case Mode.ALPHANUMERIC:
            return new AlphanumericData(data);
          case Mode.KANJI:
            return new KanjiData(data);
          case Mode.BYTE:
            return new ByteData(data);
        }
      }
      exports.fromArray = function fromArray(array) {
        return array.reduce(function(acc, seg) {
          if (typeof seg === "string") {
            acc.push(buildSingleSegment(seg, null));
          } else if (seg.data) {
            acc.push(buildSingleSegment(seg.data, seg.mode));
          }
          return acc;
        }, []);
      };
      exports.fromString = function fromString(data, version) {
        const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
        const nodes = buildNodes(segs);
        const graph = buildGraph(nodes, version);
        const path = dijkstra.find_path(graph.map, "start", "end");
        const optimizedSegs = [];
        for (let i = 1; i < path.length - 1; i++) {
          optimizedSegs.push(graph.table[path[i]].node);
        }
        return exports.fromArray(mergeSegments(optimizedSegs));
      };
      exports.rawSplit = function rawSplit(data) {
        return exports.fromArray(
          getSegmentsFromString(data, Utils.isKanjiModeEnabled())
        );
      };
    }
  });

  // node_modules/qrcode/lib/core/qrcode.js
  var require_qrcode = __commonJS({
    "node_modules/qrcode/lib/core/qrcode.js"(exports) {
      var Utils = require_utils();
      var ECLevel = require_error_correction_level();
      var BitBuffer = require_bit_buffer();
      var BitMatrix = require_bit_matrix();
      var AlignmentPattern = require_alignment_pattern();
      var FinderPattern = require_finder_pattern();
      var MaskPattern = require_mask_pattern();
      var ECCode = require_error_correction_code();
      var ReedSolomonEncoder = require_reed_solomon_encoder();
      var Version = require_version();
      var FormatInfo = require_format_info();
      var Mode = require_mode();
      var Segments = require_segments();
      function setupFinderPattern(matrix, version) {
        const size = matrix.size;
        const pos = FinderPattern.getPositions(version);
        for (let i = 0; i < pos.length; i++) {
          const row = pos[i][0];
          const col = pos[i][1];
          for (let r = -1; r <= 7; r++) {
            if (row + r <= -1 || size <= row + r) continue;
            for (let c = -1; c <= 7; c++) {
              if (col + c <= -1 || size <= col + c) continue;
              if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
                matrix.set(row + r, col + c, true, true);
              } else {
                matrix.set(row + r, col + c, false, true);
              }
            }
          }
        }
      }
      function setupTimingPattern(matrix) {
        const size = matrix.size;
        for (let r = 8; r < size - 8; r++) {
          const value = r % 2 === 0;
          matrix.set(r, 6, value, true);
          matrix.set(6, r, value, true);
        }
      }
      function setupAlignmentPattern(matrix, version) {
        const pos = AlignmentPattern.getPositions(version);
        for (let i = 0; i < pos.length; i++) {
          const row = pos[i][0];
          const col = pos[i][1];
          for (let r = -2; r <= 2; r++) {
            for (let c = -2; c <= 2; c++) {
              if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
                matrix.set(row + r, col + c, true, true);
              } else {
                matrix.set(row + r, col + c, false, true);
              }
            }
          }
        }
      }
      function setupVersionInfo(matrix, version) {
        const size = matrix.size;
        const bits = Version.getEncodedBits(version);
        let row, col, mod;
        for (let i = 0; i < 18; i++) {
          row = Math.floor(i / 3);
          col = i % 3 + size - 8 - 3;
          mod = (bits >> i & 1) === 1;
          matrix.set(row, col, mod, true);
          matrix.set(col, row, mod, true);
        }
      }
      function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
        const size = matrix.size;
        const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
        let i, mod;
        for (i = 0; i < 15; i++) {
          mod = (bits >> i & 1) === 1;
          if (i < 6) {
            matrix.set(i, 8, mod, true);
          } else if (i < 8) {
            matrix.set(i + 1, 8, mod, true);
          } else {
            matrix.set(size - 15 + i, 8, mod, true);
          }
          if (i < 8) {
            matrix.set(8, size - i - 1, mod, true);
          } else if (i < 9) {
            matrix.set(8, 15 - i - 1 + 1, mod, true);
          } else {
            matrix.set(8, 15 - i - 1, mod, true);
          }
        }
        matrix.set(size - 8, 8, 1, true);
      }
      function setupData(matrix, data) {
        const size = matrix.size;
        let inc = -1;
        let row = size - 1;
        let bitIndex = 7;
        let byteIndex = 0;
        for (let col = size - 1; col > 0; col -= 2) {
          if (col === 6) col--;
          while (true) {
            for (let c = 0; c < 2; c++) {
              if (!matrix.isReserved(row, col - c)) {
                let dark = false;
                if (byteIndex < data.length) {
                  dark = (data[byteIndex] >>> bitIndex & 1) === 1;
                }
                matrix.set(row, col - c, dark);
                bitIndex--;
                if (bitIndex === -1) {
                  byteIndex++;
                  bitIndex = 7;
                }
              }
            }
            row += inc;
            if (row < 0 || size <= row) {
              row -= inc;
              inc = -inc;
              break;
            }
          }
        }
      }
      function createData(version, errorCorrectionLevel, segments) {
        const buffer = new BitBuffer();
        segments.forEach(function(data) {
          buffer.put(data.mode.bit, 4);
          buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
          data.write(buffer);
        });
        const totalCodewords = Utils.getSymbolTotalCodewords(version);
        const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
        const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
        if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
          buffer.put(0, 4);
        }
        while (buffer.getLengthInBits() % 8 !== 0) {
          buffer.putBit(0);
        }
        const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
        for (let i = 0; i < remainingByte; i++) {
          buffer.put(i % 2 ? 17 : 236, 8);
        }
        return createCodewords(buffer, version, errorCorrectionLevel);
      }
      function createCodewords(bitBuffer, version, errorCorrectionLevel) {
        const totalCodewords = Utils.getSymbolTotalCodewords(version);
        const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
        const dataTotalCodewords = totalCodewords - ecTotalCodewords;
        const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
        const blocksInGroup2 = totalCodewords % ecTotalBlocks;
        const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
        const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
        const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
        const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
        const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
        const rs = new ReedSolomonEncoder(ecCount);
        let offset = 0;
        const dcData = new Array(ecTotalBlocks);
        const ecData = new Array(ecTotalBlocks);
        let maxDataSize = 0;
        const buffer = new Uint8Array(bitBuffer.buffer);
        for (let b = 0; b < ecTotalBlocks; b++) {
          const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
          dcData[b] = buffer.slice(offset, offset + dataSize);
          ecData[b] = rs.encode(dcData[b]);
          offset += dataSize;
          maxDataSize = Math.max(maxDataSize, dataSize);
        }
        const data = new Uint8Array(totalCodewords);
        let index = 0;
        let i, r;
        for (i = 0; i < maxDataSize; i++) {
          for (r = 0; r < ecTotalBlocks; r++) {
            if (i < dcData[r].length) {
              data[index++] = dcData[r][i];
            }
          }
        }
        for (i = 0; i < ecCount; i++) {
          for (r = 0; r < ecTotalBlocks; r++) {
            data[index++] = ecData[r][i];
          }
        }
        return data;
      }
      function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
        let segments;
        if (Array.isArray(data)) {
          segments = Segments.fromArray(data);
        } else if (typeof data === "string") {
          let estimatedVersion = version;
          if (!estimatedVersion) {
            const rawSegments = Segments.rawSplit(data);
            estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
          }
          segments = Segments.fromString(data, estimatedVersion || 40);
        } else {
          throw new Error("Invalid data");
        }
        const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
        if (!bestVersion) {
          throw new Error("The amount of data is too big to be stored in a QR Code");
        }
        if (!version) {
          version = bestVersion;
        } else if (version < bestVersion) {
          throw new Error(
            "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
          );
        }
        const dataBits = createData(version, errorCorrectionLevel, segments);
        const moduleCount = Utils.getSymbolSize(version);
        const modules = new BitMatrix(moduleCount);
        setupFinderPattern(modules, version);
        setupTimingPattern(modules);
        setupAlignmentPattern(modules, version);
        setupFormatInfo(modules, errorCorrectionLevel, 0);
        if (version >= 7) {
          setupVersionInfo(modules, version);
        }
        setupData(modules, dataBits);
        if (isNaN(maskPattern)) {
          maskPattern = MaskPattern.getBestMask(
            modules,
            setupFormatInfo.bind(null, modules, errorCorrectionLevel)
          );
        }
        MaskPattern.applyMask(maskPattern, modules);
        setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
        return {
          modules,
          version,
          errorCorrectionLevel,
          maskPattern,
          segments
        };
      }
      exports.create = function create(data, options) {
        if (typeof data === "undefined" || data === "") {
          throw new Error("No input text");
        }
        let errorCorrectionLevel = ECLevel.M;
        let version;
        let mask;
        if (typeof options !== "undefined") {
          errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
          version = Version.from(options.version);
          mask = MaskPattern.from(options.maskPattern);
          if (options.toSJISFunc) {
            Utils.setToSJISFunction(options.toSJISFunc);
          }
        }
        return createSymbol(data, version, errorCorrectionLevel, mask);
      };
    }
  });

  // node_modules/qrcode/lib/renderer/utils.js
  var require_utils2 = __commonJS({
    "node_modules/qrcode/lib/renderer/utils.js"(exports) {
      function hex2rgba(hex) {
        if (typeof hex === "number") {
          hex = hex.toString();
        }
        if (typeof hex !== "string") {
          throw new Error("Color should be defined as hex string");
        }
        let hexCode = hex.slice().replace("#", "").split("");
        if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
          throw new Error("Invalid hex color: " + hex);
        }
        if (hexCode.length === 3 || hexCode.length === 4) {
          hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
            return [c, c];
          }));
        }
        if (hexCode.length === 6) hexCode.push("F", "F");
        const hexValue = parseInt(hexCode.join(""), 16);
        return {
          r: hexValue >> 24 & 255,
          g: hexValue >> 16 & 255,
          b: hexValue >> 8 & 255,
          a: hexValue & 255,
          hex: "#" + hexCode.slice(0, 6).join("")
        };
      }
      exports.getOptions = function getOptions(options) {
        if (!options) options = {};
        if (!options.color) options.color = {};
        const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
        const width = options.width && options.width >= 21 ? options.width : void 0;
        const scale = options.scale || 4;
        return {
          width,
          scale: width ? 4 : scale,
          margin,
          color: {
            dark: hex2rgba(options.color.dark || "#000000ff"),
            light: hex2rgba(options.color.light || "#ffffffff")
          },
          type: options.type,
          rendererOpts: options.rendererOpts || {}
        };
      };
      exports.getScale = function getScale(qrSize, opts) {
        return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
      };
      exports.getImageWidth = function getImageWidth(qrSize, opts) {
        const scale = exports.getScale(qrSize, opts);
        return Math.floor((qrSize + opts.margin * 2) * scale);
      };
      exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
        const size = qr.modules.size;
        const data = qr.modules.data;
        const scale = exports.getScale(size, opts);
        const symbolSize = Math.floor((size + opts.margin * 2) * scale);
        const scaledMargin = opts.margin * scale;
        const palette = [opts.color.light, opts.color.dark];
        for (let i = 0; i < symbolSize; i++) {
          for (let j = 0; j < symbolSize; j++) {
            let posDst = (i * symbolSize + j) * 4;
            let pxColor = opts.color.light;
            if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
              const iSrc = Math.floor((i - scaledMargin) / scale);
              const jSrc = Math.floor((j - scaledMargin) / scale);
              pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
            }
            imgData[posDst++] = pxColor.r;
            imgData[posDst++] = pxColor.g;
            imgData[posDst++] = pxColor.b;
            imgData[posDst] = pxColor.a;
          }
        }
      };
    }
  });

  // node_modules/qrcode/lib/renderer/canvas.js
  var require_canvas = __commonJS({
    "node_modules/qrcode/lib/renderer/canvas.js"(exports) {
      var Utils = require_utils2();
      function clearCanvas(ctx, canvas, size) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!canvas.style) canvas.style = {};
        canvas.height = size;
        canvas.width = size;
        canvas.style.height = size + "px";
        canvas.style.width = size + "px";
      }
      function getCanvasElement() {
        try {
          return document.createElement("canvas");
        } catch (e) {
          throw new Error("You need to specify a canvas element");
        }
      }
      exports.render = function render(qrData, canvas, options) {
        let opts = options;
        let canvasEl = canvas;
        if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
          opts = canvas;
          canvas = void 0;
        }
        if (!canvas) {
          canvasEl = getCanvasElement();
        }
        opts = Utils.getOptions(opts);
        const size = Utils.getImageWidth(qrData.modules.size, opts);
        const ctx = canvasEl.getContext("2d");
        const image = ctx.createImageData(size, size);
        Utils.qrToImageData(image.data, qrData, opts);
        clearCanvas(ctx, canvasEl, size);
        ctx.putImageData(image, 0, 0);
        return canvasEl;
      };
      exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
        let opts = options;
        if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
          opts = canvas;
          canvas = void 0;
        }
        if (!opts) opts = {};
        const canvasEl = exports.render(qrData, canvas, opts);
        const type = opts.type || "image/png";
        const rendererOpts = opts.rendererOpts || {};
        return canvasEl.toDataURL(type, rendererOpts.quality);
      };
    }
  });

  // node_modules/qrcode/lib/renderer/svg-tag.js
  var require_svg_tag = __commonJS({
    "node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
      var Utils = require_utils2();
      function getColorAttrib(color, attrib) {
        const alpha = color.a / 255;
        const str = attrib + '="' + color.hex + '"';
        return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
      }
      function svgCmd(cmd, x, y) {
        let str = cmd + x;
        if (typeof y !== "undefined") str += " " + y;
        return str;
      }
      function qrToPath(data, size, margin) {
        let path = "";
        let moveBy = 0;
        let newRow = false;
        let lineLength = 0;
        for (let i = 0; i < data.length; i++) {
          const col = Math.floor(i % size);
          const row = Math.floor(i / size);
          if (!col && !newRow) newRow = true;
          if (data[i]) {
            lineLength++;
            if (!(i > 0 && col > 0 && data[i - 1])) {
              path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
              moveBy = 0;
              newRow = false;
            }
            if (!(col + 1 < size && data[i + 1])) {
              path += svgCmd("h", lineLength);
              lineLength = 0;
            }
          } else {
            moveBy++;
          }
        }
        return path;
      }
      exports.render = function render(qrData, options, cb) {
        const opts = Utils.getOptions(options);
        const size = qrData.modules.size;
        const data = qrData.modules.data;
        const qrcodesize = size + opts.margin * 2;
        const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
        const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
        const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
        const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
        const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
        if (typeof cb === "function") {
          cb(null, svgTag);
        }
        return svgTag;
      };
    }
  });

  // node_modules/qrcode/lib/browser.js
  var require_browser = __commonJS({
    "node_modules/qrcode/lib/browser.js"(exports) {
      var canPromise = require_can_promise();
      var QRCode = require_qrcode();
      var CanvasRenderer = require_canvas();
      var SvgRenderer = require_svg_tag();
      function renderCanvas(renderFunc, canvas, text, opts, cb) {
        const args = [].slice.call(arguments, 1);
        const argsNum = args.length;
        const isLastArgCb = typeof args[argsNum - 1] === "function";
        if (!isLastArgCb && !canPromise()) {
          throw new Error("Callback required as last argument");
        }
        if (isLastArgCb) {
          if (argsNum < 2) {
            throw new Error("Too few arguments provided");
          }
          if (argsNum === 2) {
            cb = text;
            text = canvas;
            canvas = opts = void 0;
          } else if (argsNum === 3) {
            if (canvas.getContext && typeof cb === "undefined") {
              cb = opts;
              opts = void 0;
            } else {
              cb = opts;
              opts = text;
              text = canvas;
              canvas = void 0;
            }
          }
        } else {
          if (argsNum < 1) {
            throw new Error("Too few arguments provided");
          }
          if (argsNum === 1) {
            text = canvas;
            canvas = opts = void 0;
          } else if (argsNum === 2 && !canvas.getContext) {
            opts = text;
            text = canvas;
            canvas = void 0;
          }
          return new Promise(function(resolve, reject) {
            try {
              const data = QRCode.create(text, opts);
              resolve(renderFunc(data, canvas, opts));
            } catch (e) {
              reject(e);
            }
          });
        }
        try {
          const data = QRCode.create(text, opts);
          cb(null, renderFunc(data, canvas, opts));
        } catch (e) {
          cb(e);
        }
      }
      exports.create = QRCode.create;
      exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
      exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
      exports.toString = renderCanvas.bind(null, function(data, _, opts) {
        return SvgRenderer.render(data, opts);
      });
    }
  });

  // src/qr-entry.js
  var qr_entry_exports = {};
  __export(qr_entry_exports, {
    qrcode: () => qrcode
  });
  var qrcode = __toESM(require_browser(), 1);
  return __toCommonJS(qr_entry_exports);
})();

var QRCode = (typeof WBQR !== "undefined" && (WBQR.default || WBQR.qrcode || WBQR)) || undefined;
/**
 * dsh-workbuddy-hub — browser half.
 *
 * Interaction is modelled on WorkBuddy's "+" surface (three screenshots):
 *
 *   composer "+"  → first-level menu (专家 / 技能 / 连接器)
 *                 → right-hand pane: search + cards (中文名 + 简介 + icon)
 *   attached items → icon rail BELOW the composer card (stacks horizontally)
 *   sidebar panel → full market browsing (same data, larger layout)
 *
 * Slot choice follows the shipped owners:
 *   conversation.input.left      compact "+" control
 *   conversation.composer.dock    ambient rail BELOW the card (never overlays input)
 *   sidebar.panellist + main      global market page
 *   settings.plugins.tab          status page
 *
 * Host owns every state and credential; the browser only calls
 * /workbuddy-hub/* same-origin routes and never receives secret values.
 */
window.__ModuleLoader__.load({
  id: 'dsh-workbuddy-hub',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports
    const React = require('react')
    const { createElement: h, useCallback, useEffect, useMemo, useRef, useState } = React

    const API = '/workbuddy-hub'
    const EVENT = 'dsh-workbuddy-hub:changed'
    const KINDS = [
      { id: 'expert', plural: 'experts', label: '专家', hint: '召唤专业角色（人设 + 方法论）' },
      { id: 'skill', plural: 'skills', label: '技能', hint: '按需加载的能力包' },
      { id: 'connector', plural: 'connectors', label: '连接器', hint: '连接外部服务与数据' },
    ]
    const kindOf = id => KINDS.find(k => k.id === id) || KINDS[0]
    const notify = () => window.dispatchEvent(new Event(EVENT))
    // Filled during apply(); the host command channel is how a summon actually
    // reaches the live Agent (the browser cannot call spawnTeammate directly).
    let pluginCtx = null
    /** Resolve the commands Remote at CALL time: the remotes module can finish
        loading after this plugin's apply(), so caching it eagerly loses it. */
    const commandsRemote = () => {
      // The generated namespaces are client *services*: `@deepseek-ai/dsh-api-remotes`
      // mounts `commands` as `remote.commands`, which is how the shipped command
      // plugins reach it. Reading it lazily also survives load-order differences.
      try { return pluginCtx?.get?.('remote.commands') ?? null } catch { return null }
    }
    const runCommand = async (sessionId, line) => {
      if (!sessionId) return { ok: false, error: '当前没有会话，无法执行命令' }
      const remote = commandsRemote()
      if (remote === null) return { ok: false, error: '命令通道不可用（remotes 未就绪）' }
      try {
        const result = await remote.execute(sessionId, line, [])
        if (!result?.ok) return { ok: false, error: result?.error?.message || '命令执行失败' }
        return { ok: true, value: result.value?.result }
      } catch (error) {
        return { ok: false, error: String(error?.message || error) }
      }
    }

    /* Real WorkBuddy icon geometry, extracted from their shipped marketplace
       bundle (viewBox + presentation attributes + body). Rendered inline so
       the widget uses the same shapes as the official client. */
    const WB_ICONS = {
      plus: ['0 0 16 16', 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 1.5 1.49597)" d="M7.165 7.165L7.165 13L5.835 13L5.835 7.165L0 7.165L0 5.835L5.835 5.835L5.835 0L7.165 0L7.165 5.835L13 5.835L13 7.165L7.165 7.165Z"></path>'],
      person: ['0 0 12 12', 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1Z" stroke="currentColor" stroke-width="1"></path><path d="M6 3V9" stroke="currentColor" stroke-width="1" stroke-linecap="round"></path><path d="M3 6H9" stroke="currentColor" stroke-width="1" stroke-linecap="round"></path>'],
      sparkle: ['0 0 16 16', 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path fill="currentColor" d="M6.1838 2.2198C6.6022 1.3093 7.8641 1.2266 8.1057 2.0938L8.84 4.7335C8.992 5.2783 9.3896 5.6893 9.929 5.8595L12.5432 6.6827C13.4014 6.9536 13.2757 8.2113 12.3517 8.5987L9.9973 9.5861L9.8362 9.6583C9.0366 10.0399 8.3731 10.7089 8.0031 11.5138L6.9377 13.8341L6.8488 13.9943C6.3971 14.7003 5.39 14.7669 5.0735 14.1115L5.0158 13.9601L4.2815 11.3205C4.1485 10.8435 3.8277 10.4679 3.3879 10.2677L3.1916 10.1935L0.5783 9.3712C-0.2801 9.1005 -0.155 7.8418 0.7687 7.4542L3.1242 6.4679C3.9412 6.1253 4.632 5.4846 5.0403 4.6983L5.1183 4.5392L6.1838 2.2198ZM6.2004 4.88C5.652 6.0736 4.6394 7.0538 3.4279 7.5616L1.5295 8.3565L3.719 9.046C4.5745 9.3157 5.2059 9.9689 5.4465 10.8331L6.0608 13.0431L6.9201 11.174C7.4685 9.9802 8.4821 9.0001 9.6935 8.4923L11.591 7.6964L9.4025 7.0069C8.547 6.7373 7.9156 6.085 7.675 5.2208L7.0598 3.0099L6.2004 4.88ZM12.7072 0.214C12.8295 -0.052 13.198 -0.0764 13.2687 0.1768L13.6194 1.4395C13.6415 1.5192 13.7005 1.5797 13.7795 1.6046L15.0285 1.9981C15.2795 2.0772 15.243 2.4445 14.9728 2.5577L13.6281 3.1212C13.5431 3.1568 13.4722 3.226 13.4338 3.3097L12.8254 4.6349C12.703 4.9009 12.3344 4.9245 12.2639 4.671L11.9124 3.4093C11.8901 3.3296 11.8319 3.2691 11.7531 3.2442L10.5031 2.8507C10.2522 2.7715 10.2888 2.4045 10.5588 2.2911L11.9035 1.7267C11.9884 1.6911 12.0593 1.6228 12.0978 1.5392L12.7072 0.214Z"></path>'],
      link: ['0 0 16 16', 'xmlns="http://www.w3.org/2000/svg"', '<path fill="currentColor" transform="matrix(1 0 0 1 0.435199 0.715962)" d="M7.5656 4.2827C8.2868 4.6991 8.7999 5.2128 9.1214 5.8068C9.4424 6.4 9.5528 7.0359 9.5284 7.6644C9.5192 7.8997 9.4911 8.1358 9.4474 8.3709L8.3226 7.7215C8.325 7.6869 8.3279 7.6525 8.3293 7.6183C8.3469 7.1636 8.2661 6.7484 8.0655 6.3778C7.8653 6.0082 7.5257 5.6444 6.966 5.3213C6.4063 4.9981 5.9214 4.8859 5.5013 4.8973C5.08 4.9089 4.68 5.0465 4.2951 5.2892C3.5056 5.787 2.8232 6.6961 2.254 7.6819C1.6848 8.6678 1.2387 9.7133 1.2024 10.6459C1.1847 11.1006 1.2655 11.5158 1.4661 11.8864C1.6663 12.256 2.0059 12.6198 2.5656 12.9429C3.1254 13.2661 3.6102 13.3783 4.0304 13.3669C4.4516 13.3553 4.8516 13.2177 5.2365 12.975C5.7924 12.6245 6.2937 12.0689 6.7412 11.4273L7.784 12.0294C7.2672 12.7855 6.6365 13.511 5.876 13.9904C5.3439 14.3258 4.738 14.5482 4.0638 14.5668C3.3886 14.5853 2.6872 14.3978 1.966 13.9815C1.2448 13.5651 0.7317 13.0514 0.4102 12.4574C0.0892 11.8642 -0.0211 11.2283 0.0033 10.5998C0.0512 9.3663 0.6211 8.1118 1.2154 7.0823C1.8098 6.0528 2.6114 4.932 3.6556 4.2738C4.1877 3.9384 4.7936 3.716 5.4678 3.6974C6.143 3.6789 6.8445 3.8663 7.5656 4.2827ZM13.1637 0.5865C13.8848 1.0029 14.3979 1.5167 14.7195 2.1106C15.0405 2.7038 15.1508 3.3397 15.1264 3.9683C15.0785 5.2017 14.5086 6.4563 13.9142 7.4858C13.3199 8.5153 12.5183 9.636 11.4741 10.2943C10.942 10.6296 10.3361 10.8521 9.6618 10.8706C8.9867 10.8892 8.2852 10.7017 7.5641 10.2853C6.8429 9.869 6.3298 9.3552 6.0083 8.7613C5.6873 8.1681 5.5769 7.5322 5.6013 6.9037C5.6105 6.6684 5.6386 6.4323 5.6823 6.1971L6.8071 6.8465C6.8046 6.8811 6.8018 6.9155 6.8004 6.9498C6.7828 7.4045 6.8636 7.8197 7.0642 8.1903C7.2643 8.5599 7.6039 8.9236 8.1637 9.2468C8.7234 9.5699 9.2083 9.6822 9.6284 9.6707C10.0497 9.6591 10.4496 9.5215 10.8346 9.2789C11.6241 8.7811 12.3065 7.872 12.8757 6.8862C13.4449 5.9003 13.8909 4.8548 13.9273 3.9221C13.945 3.4674 13.8642 3.0523 13.6636 2.6816C13.4634 2.3121 13.1238 1.9483 12.5641 1.6251C12.0043 1.3019 11.5195 1.1897 11.0993 1.2012C10.6781 1.2128 10.2781 1.3504 9.8932 1.593C9.3373 1.9435 8.836 2.4991 8.3884 3.1407L7.3456 2.5387C7.8624 1.7825 8.4932 1.057 9.2537 0.5776C9.7858 0.2422 10.3917 0.0198 11.0659 0.0013C11.7411 -0.0173 12.4425 0.1702 13.1637 0.5865Z"></path>'],
      search: ['0 0 16 16', 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>'],
      more: ['0 0 16 16', 'xmlns="http://www.w3.org/2000/svg"', '<path fill="currentColor" transform="matrix(1 0 0 1 2 7)" d="M0 1C0 0.4477 0.4477 0 1 0C1.5523 0 2 0.4477 2 1C2 1.5523 1.5523 2 1 2C0.4477 2 0 1.5523 0 1ZM5 1C5 0.4477 5.4477 0 6 0C6.5523 0 7 0.4477 7 1C7 1.5523 6.5523 2 6 2C5.4477 2 5 1.5523 5 1ZM10 1C10 0.4477 10.4477 0 11 0C11.5523 0 12 0.4477 12 1C12 1.5523 11.5523 2 11 2C10.4477 2 10 1.5523 10 1Z"></path>'],
      trash: ['0 0 16 16', 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M2.5 4H13.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"></path><path d="M6 4V2.5C6 2.22386 6.22386 2 6.5 2H9.5C9.77614 2 10 2.22386 10 2.5V4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.5 4V13C3.5 13.5523 3.94772 14 4.5 14H11.5C12.0523 14 12.5 13.5523 12.5 13V4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.5 7V11M9.5 7V11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"></path>'],
      refresh: ['0 0 24 24', 'xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"', '<polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>'],
      check: ['0 0 16 16', 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M3 8L6.5 11.5L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>'],
      close: ['0 0 16 16', 'xmlns="http://www.w3.org/2000/svg" fill="none"', '<path fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 2.56512 2.56512)" d="M6.3046 5.4349L10.8698 10L10 10.8698L5.4349 6.3046L0.8698 10.8698L0 10L4.5651 5.4349L0 0.8698L0.8698 0L5.4349 4.5651L10 0L10.8698 0.8698L6.3046 5.4349Z"></path>'],
      external: ['0 0 24 24', 'xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"', '<path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"></path><path d="m21 3-9 9"></path><path d="M15 3h6v6"></path>'],
      download: ['0 0 16 16', 'xmlns="http://www.w3.org/2000/svg" fill="none"', '<path d="M8 11.3333V2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 7.33301L8 11.333L12 7.33301" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.6666 14H3.33325" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>'],
      gear: ['0 0 24 24', 'xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"', '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>'],
      grid: ['0 0 12 13', 'xmlns="http://www.w3.org/2000/svg" fill="none"', '<g clip-path="url(#clip0_30165_28096)"><path d="M6.00011 1.25003L6.00011 11.7501" stroke="currentColor" stroke-width="0.975" stroke-linecap="round" stroke-linejoin="round"></path><rect x="7.875" y="5" width="3.375" height="3" stroke="currentColor" stroke-width="0.975" stroke-linecap="round" stroke-linejoin="round"></rect><rect x="0.75" y="5" width="3.375" height="3" stroke="currentColor" stroke-width="0.975" stroke-linecap="round" stroke-linejoin="round"></rect></g><defs ><clipPath id="clip0_30165_28096"><rect width="12" height="12" fill="currentColor" transform="translate(0 0.5)"></rect></clipPath></defs>'],
      bell: ['0 0 12 12', 'xmlns="http://www.w3.org/2000/svg" fill="none"', '<path d="M7.5 1H4.5C4.22386 1 4 1.22386 4 1.5V2.5C4 2.77614 4.22386 3 4.5 3H7.5C7.77614 3 8 2.77614 8 2.5V1.5C8 1.22386 7.77614 1 7.5 1Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 2H9C9.26522 2 9.51957 2.10536 9.70711 2.29289C9.89464 2.48043 10 2.73478 10 3V10C10 10.2652 9.89464 10.5196 9.70711 10.7071C9.51957 10.8946 9.26522 11 9 11H3C2.73478 11 2.48043 10.8946 2.29289 10.7071C2.10536 10.5196 2 10.2652 2 10V3C2 2.73478 2.10536 2.48043 2.29289 2.29289C2.48043 2.10536 2.73478 2 3 2H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 5.5H8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 8H8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 5.5H4.005" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 8H4.005" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>'],
      chevronRight: ['0 0 14 14', 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M5 3.5 9 7l-4 3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>'],
      chevronLeft: ['0 0 16 16', 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>'],
      chevronDown: ['0 0 14 14', 'xmlns="http://www.w3.org/2000/svg" fill="none" transition="transform 0.2s ease"', '<path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>'],
    }

    /** One WorkBuddy icon at an arbitrary size, coloured by currentColor. */
    function WbIcon({ name, size = 16, className }) {
      const spec = WB_ICONS[name]
      if (spec === undefined) return null
      return h('svg', {
        viewBox: spec[0], width: size, height: size, className,
        'aria-hidden': true, focusable: false,
        dangerouslySetInnerHTML: { __html: spec[2] },
      })
    }

    /** Line-art glyphs: text glyphs (◇✦⌁) fall back to tofu in some fonts. */
    const KIND_ICON = { expert: 'person', skill: 'sparkle', connector: 'link' }

    /** Kind glyphs, using the icons WorkBuddy itself renders for each kind. */
    function KindIcon({ kind, size = 15 }) {
      return h(WbIcon, { name: KIND_ICON[kind] ?? 'link', size })
    }

    const STYLE = `
.wbh-root{font:inherit;color:var(--dsw-alias-label-primary)}
.wbh-plus{display:grid;place-items:center;flex:none;width:28px;height:28px;padding:0;border:none;border-radius:999px;background:var(--dsw-specific-selector);color:var(--dsw-alias-label-primary);cursor:pointer;transition:background-color 100ms ease}
.wbh-plus:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-solid)}
.wbh-plus[aria-expanded="true"]{background:var(--dsw-alias-interactive-bg-hover-solid)}
.wbh-anchor{position:relative;display:inline-flex;z-index:1}
.wbh-scrim{position:fixed;inset:0;z-index:6240}
.wbh-menu{position:absolute;left:0;bottom:calc(100% + 10px);z-index:6250;display:flex;align-items:flex-start;animation:wbhPopIn .15s ease}
.wbh-menuCol{display:flex;flex-direction:column;width:196px;padding:5px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 8px 24px rgba(0,0,0,.12)}
.wbh-menuRow{display:flex;align-items:center;gap:9px;padding:8px 9px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12.5px;cursor:pointer;text-align:left;transition:background .15s ease}
.wbh-menuRow:hover,.wbh-menuRow.on{background:var(--dsw-alias-bg-layer-2)}
.wbh-menuRow.on{font-weight:600}
.wbh-menuRowIcon{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;flex:0 0 auto;font-size:13px;color:var(--dsw-alias-label-secondary)}
.wbh-menuRowLabel{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wbh-menuRowChev{color:var(--dsw-alias-label-tertiary);font-size:11px}
.wbh-pane{display:flex;flex-direction:column;align-self:flex-start;width:min(420px,calc(100vw - 240px));max-height:min(440px,calc(100vh - 140px));margin-left:7px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 8px 24px rgba(0,0,0,.12);overflow:hidden;animation:wbhPaneIn .15s ease}
.wbh-paneHead{display:flex;align-items:center;gap:8px;padding:9px 10px;border-bottom:1px solid var(--dsw-alias-border-l2)}
.wbh-search{box-sizing:border-box;flex:1;min-width:0;padding:6px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;outline:none}
.wbh-search:focus{border-color:var(--dsw-alias-label-info,#5b8cff)}
.wbh-paneList{flex:1;min-height:120px;overflow:auto;padding:6px}
.wbh-item{display:flex;align-items:center;gap:10px;width:100%;padding:8px 9px;border:0;border-radius:6px;background:transparent;color:inherit;font:inherit;cursor:pointer;text-align:left;transition:background .15s ease}
.wbh-item:hover{background:var(--dsw-alias-bg-layer-2)}
.wbh-item:disabled{opacity:.6;cursor:default}
.wbh-avatar{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:26px;height:26px;border-radius:8px;overflow:hidden;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600}
.wbh-avatar img{width:100%;height:100%;object-fit:cover;display:block}
.wbh-itemBody{flex:1;min-width:0}
.wbh-itemName{display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:var(--dsw-alias-label-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wbh-itemDesc{margin-top:2px;font-size:11px;line-height:1.45;color:var(--dsw-alias-label-tertiary);overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}
.wbh-tag{flex:0 0 auto;padding:1px 6px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;font-size:9.5px;color:var(--dsw-alias-label-secondary);font-weight:400}
.wbh-action{flex:0 0 auto;padding:3px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:11px;cursor:pointer;transition:background .12s ease}
.wbh-action:hover{background:var(--dsw-alias-bg-layer-3)}
.wbh-action.primary{border-color:var(--dsw-alias-label-info,#5b8cff);color:var(--dsw-alias-label-info,#5b8cff)}
.wbh-action:disabled{opacity:.55;cursor:default}
.wbh-connect{flex:0 0 auto;display:inline-flex;align-items:center;gap:4px;padding:3px 11px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:11px;cursor:pointer;transition:background .12s ease}
.wbh-connect:hover:not(:disabled){background:var(--dsw-alias-bg-layer-3)}
.wbh-connect:disabled{opacity:.55;cursor:default}
.wbh-switch{flex:0 0 auto;position:relative;width:34px;height:18px;padding:0;border:0;border-radius:999px;background:var(--dsw-alias-bg-layer-3);cursor:pointer;transition:background .18s ease}
.wbh-switch.on{background:var(--dsw-alias-label-info,#5b8cff)}
.wbh-switch i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .18s cubic-bezier(.4,0,.2,1)}
.wbh-switch.on i{transform:translateX(16px)}
.wbh-paneFoot{display:flex;align-items:center;gap:8px;padding:8px 10px;border-top:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);font-size:11.5px;cursor:pointer}
.wbh-paneFoot:hover{background:var(--dsw-alias-bg-layer-2)}
.wbh-empty{padding:22px 12px;text-align:center;color:var(--dsw-alias-label-tertiary);font-size:11.5px;line-height:1.6}
.wbh-rail{display:flex;align-items:center;gap:7px;padding:0 2px 2px;animation:wbhRise .18s ease-out}
.wbh-railChip{display:inline-flex;align-items:center;gap:6px;padding:3px 8px 3px 4px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-layer-2);font-size:11px;color:var(--dsw-alias-label-secondary);cursor:default;transition:background .12s ease}
.wbh-railChip:hover{background:var(--dsw-alias-bg-layer-3)}
.wbh-railChip .wbh-avatar{width:18px;height:18px;border-radius:50%;font-size:9.5px}
.wbh-railName{max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary)}
.wbh-railX{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;padding:0;border:0;border-radius:50%;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer;font-size:11px;line-height:1}
.wbh-railX:hover{background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-danger,#d14343)}
.wbh-shell{box-sizing:border-box;width:100%;height:100%;min-height:0;overflow:auto;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}
.wbh-page{box-sizing:border-box;max-width:1080px;margin:0 auto;padding:26px 30px 40px}
.wbh-pageHead{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px}
.wbh-pageTitle{margin:0;font-size:19px;font-weight:650;letter-spacing:-.01em}
.wbh-pageSub{margin:6px 0 0;font-size:12px;color:var(--dsw-alias-label-secondary)}
.wbh-stat{display:inline-flex;align-items:center;gap:6px;flex:0 0 auto;padding:5px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-layer-2);font-size:11px;color:var(--dsw-alias-label-secondary);white-space:nowrap}
.wbh-dot{width:7px;height:7px;border-radius:50%;background:var(--dsw-alias-label-success,#2b8a3e)}
.wbh-panel{border:1px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-layer-1);overflow:hidden}
.wbh-panelHead{display:flex;align-items:center;gap:6px;padding:9px 11px;border-bottom:1px solid var(--dsw-alias-border-l2)}
.wbh-tab{padding:6px 13px;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;cursor:pointer;transition:background .15s ease,color .15s ease}
.wbh-tab:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}
.wbh-tab.on{background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);font-weight:600}
.wbh-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:8px;padding:11px;max-height:min(58vh,560px);overflow:auto}
.wbh-card{display:flex;align-items:flex-start;gap:10px;padding:10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);transition:background .15s ease}
.wbh-card:hover{background:var(--dsw-alias-bg-layer-3)}
.wbh-card .wbh-avatar{width:30px;height:30px;border-radius:9px;font-size:13px}
.wbh-flags{margin-top:4px;font-size:10px;color:var(--dsw-alias-label-warning,#b8860b)}
.wbh-note{padding:8px 12px;border-top:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:1.55}
.wbh-settings{box-sizing:border-box;max-width:840px;padding:22px 26px;display:flex;flex-direction:column;gap:13px}
.wbh-secTitle{margin:0 0 7px;font-size:13px;font-weight:650}
.wbh-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 11px;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-layer-2);margin-bottom:6px}
/* WorkBuddy's enter motion (cb-plugin-dropdown-in): opacity plus a 4px slide over
   .15s ease. This popover opens upward, so the slide arrives from below. */
@keyframes wbhPopIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
@keyframes wbhPaneIn{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:translateX(0)}}
@keyframes wbhModalIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
@keyframes wbhScrimIn{from{opacity:0}to{opacity:1}}
.wbh-modalRoot{position:fixed;inset:0;z-index:1300;display:grid;place-items:center}
.wbh-modalScrim{position:absolute;inset:0;background:rgba(0,0,0,.28);animation:wbhScrimIn .15s ease}
.wbh-modal{position:relative;width:min(520px,calc(100vw - 40px));padding:16px;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 8px 24px rgba(0,0,0,.12);animation:wbhModalIn .15s ease}
.wbh-modalHead{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.wbh-modalTitle{margin:0;font-size:14px;font-weight:650;color:var(--dsw-alias-label-primary)}
.wbh-modalSub{margin:2px 0 0;font-size:11px;color:var(--dsw-alias-label-tertiary)}
.wbh-modalDesc{margin:0 0 10px;font-size:12px;line-height:1.6;color:var(--dsw-alias-label-secondary)}
.wbh-modalInput{box-sizing:border-box;width:100%;padding:8px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;resize:vertical;outline:none}
.wbh-modalInput:focus{border-color:var(--dsw-alias-label-info,#5b8cff)}
.wbh-modalFoot{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}
.wbh-btnGhost,.wbh-btnPrimary{padding:5px 14px;border-radius:8px;font:inherit;font-size:12px;cursor:pointer;transition:background .15s ease}
.wbh-searchIcon{display:inline-flex;align-items:center;color:var(--dsw-alias-label-tertiary);flex:none}
.wbh-btnGhost,.wbh-btnPrimary{display:inline-flex;align-items:center;gap:5px}
.wbh-menuRowChev svg,.wbh-cardMenu svg{display:block}

.wbh-btnGhost{border:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-primary)}
.wbh-btnGhost:hover{background:var(--dsw-alias-bg-layer-2)}
.wbh-btnPrimary{border:1px solid transparent;background:var(--dsw-alias-button-info-fill,#3b7dff);color:#fff}
.wbh-btnPrimary:hover:not(:disabled){filter:brightness(1.05)}
.wbh-btnPrimary:disabled{opacity:.6;cursor:default}
@media(max-width:760px){.wbh-menu{flex-direction:column;left:-40px}.wbh-pane{width:min(420px,calc(100vw - 28px));margin:6px 0 0;max-height:46vh}.wbh-grid{grid-template-columns:1fr}}
/* ================= WorkBuddy parity layer =================
   Geometry, typography, radii, shadows and hover behaviour are taken from
   WorkBuddy's shipped marketplace stylesheet (cb-plugins-marketplace-*,
   cb-plugins-card-*, cb-plugin-detail-dropdown*), mapped onto DSH's alias
   tokens so the widget still follows the active theme. Rules here come last,
   so they override the earlier Draft look of the same selectors. */
.wbh-tabs{display:flex;align-items:center;gap:8px;margin-bottom:16px;padding:0;border-bottom:0;flex-wrap:wrap}
.wbh-tab{display:flex;align-items:center;gap:4px;padding:6px 8px 6px 12px;border-radius:16px;border:1px solid var(--dsw-alias-border-l2);background:transparent;font-size:13px;color:var(--dsw-alias-label-secondary);transition:all .15s ease}
.wbh-tab:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.wbh-tab.on{background:var(--dsw-alias-interactive-bg-hover-solid);border-color:var(--dsw-alias-label-info,#0078d4);color:var(--dsw-alias-label-primary);font-weight:500}
.wbh-menuRow{padding:8px 12px;border-radius:4px;font-size:13px}
.wbh-item{padding:8px 12px;border-radius:4px}
.wbh-itemName{font-size:13px}
.wbh-itemDesc{font-size:12px;line-height:1.5;-webkit-line-clamp:2}
.wbh-card{padding:16px;gap:8px;border-radius:8px;align-items:center;transition:all .15s ease;cursor:pointer;position:relative}
.wbh-card:hover{border-color:var(--dsw-alias-label-info,#0078d4);background:var(--dsw-alias-bg-layer-1)}
.wbh-card .wbh-itemDesc{font-size:13px;color:var(--dsw-alias-label-secondary)}
.wbh-card .wbh-action,.wbh-card .wbh-connect,.wbh-card .wbh-switch{opacity:0;visibility:hidden;transition:opacity .15s ease}
.wbh-card:hover .wbh-action,.wbh-card:hover .wbh-connect,.wbh-card:hover .wbh-switch,
.wbh-card .wbh-switch.on{opacity:1;visibility:visible}
.wbh-cardMenu{position:absolute;top:8px;right:8px;display:flex;align-items:center;justify-content:center;width:20px;height:20px;padding:0;border:0;border-radius:4px;background:transparent;color:var(--dsw-alias-label-primary);opacity:.6;cursor:pointer;transition:all .15s ease}
.wbh-cardMenu:hover{opacity:1;background:var(--dsw-alias-bg-layer-3)}
.wbh-chipFilter{display:flex;align-items:center;gap:6px;padding:4px 8px;border:1px solid var(--dsw-alias-border-l2);border-radius:4px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-size:12px;max-width:200px}
.wbh-chipFilter span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wbh-chipFilter button{width:12px;height:12px;padding:0;border:0;background:transparent;color:inherit;opacity:.7;cursor:pointer;line-height:1}
.wbh-chipFilter button:hover{opacity:1}
/* WorkBuddy's marketplace page is bare: pill row, then the search field, then the
   card grid — no surrounding bordered panel. */
.wbh-panel{border:0;background:transparent;border-radius:0;overflow:visible}
.wbh-panelHead{padding:0;border-bottom:0;margin-bottom:12px}
.wbh-tabs{padding:0;border-bottom:0;background:transparent;margin:0 0 16px}
.wbh-grid{padding:0;gap:10px}
.wbh-addBtn{display:flex;align-items:center;justify-content:center;width:32px;height:32px;padding:0;border:1px dashed var(--dsw-alias-border-l3);border-radius:16px;background:transparent;color:var(--dsw-alias-label-primary);opacity:.6;cursor:pointer;transition:all .15s ease}
.wbh-addBtn:hover{opacity:1;border-color:var(--dsw-alias-label-info,#0078d4);background:var(--dsw-alias-bg-layer-2)}
.wbh-menuRowChev{width:14px;height:14px;display:inline-flex;align-items:center;justify-content:center}
/* Confirm / authorisation dialogs follow the panel language: 10px radius and the
   same 0 8px 24px 12% shadow the marketplace dropdown uses. */
.wbh-modal{padding:20px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.12)}
.wbh-modalTitle{font-size:15px;font-weight:600}
.wbh-modalBadge{display:inline-flex;align-items:center;gap:4px;padding:1px 8px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;font-size:11px;color:var(--dsw-alias-label-secondary)}
.wbh-authRow{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);margin-bottom:8px}
.wbh-authKey{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:var(--dsw-alias-label-secondary)}
.wbh-modalIcon{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;background:var(--dsw-alias-bg-layer-3)}

/* ---- 腾讯账号扫码卡（设置页） ---- */
.wbh-dotOff{background:var(--dsw-alias-label-tertiary)}
.wbh-authCard{position:relative;width:min(560px,calc(100vw - 48px));max-height:calc(100vh - 80px);overflow:auto;padding:24px;border-radius:16px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 8px 24px rgba(0,0,0,.12);animation:wbhModalIn .15s ease}
.wbh-authHead{display:flex;align-items:center;justify-content:space-between;gap:12px}
.wbh-authTitle{margin:0;font-size:17px;font-weight:650;color:var(--dsw-alias-label-primary)}
.wbh-authClose{width:28px;height:28px;border:none;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:13px}
.wbh-authClose:hover{background:var(--dsw-alias-bg-layer-3)}
.wbh-authDesc{margin:8px 0 14px;font-size:12.5px;line-height:1.7;color:var(--dsw-alias-label-secondary)}
.wbh-authQr{display:grid;place-items:center;padding:12px;margin:0 auto 12px;width:min(344px,100%);border-radius:12px;background:#fff}
.wbh-authQr img{display:block;width:320px;height:320px}
.wbh-authLink{display:block;width:100%;text-align:left;padding:8px 12px;border:none;border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-info,#2f6bff);font-size:12px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wbh-authCopy{display:block;margin:10px auto 0;padding:6px 16px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:transparent;color:var(--dsw-alias-label-primary);font-size:13px;cursor:pointer}
.wbh-authCopy:hover{background:var(--dsw-alias-bg-layer-2)}
.wbh-authWaiting{margin:14px 0 0;text-align:center;font-size:12px;color:var(--dsw-alias-label-secondary)}
.wbh-authCancel{display:block;width:100%;margin-top:16px;padding:10px;border-radius:12px}
.wbh-authDone{padding:20px 0 6px;text-align:center}
.wbh-authDone p{margin:0 0 14px;font-size:13px;color:var(--dsw-alias-label-primary)}
.wbh-authError{color:#c0392b}

/* ---- 官方账号状态条 ---- */
.wbh-authBar{display:flex;align-items:center;gap:10px;margin:0 24px 10px}
.wbh-authState{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--dsw-alias-label-secondary)}
`

    /* ---------------- data layer ---------------- */

    const api = async (path, options) => {
      const response = await fetch(API + path, options)
      const body = await response.json().catch(() => ({}))
      if (!response.ok) {
        const error = new Error(body.error || `HTTP ${response.status}`)
        // Structured details (e.g. credentialRefs) drive the UI's next step.
        error.body = body
        error.status = response.status
        throw error
      }
      return body
    }
    const post = (path, payload) => api(path, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const useRevision = () => {
      const [revision, setRevision] = useState(0)
      useEffect(() => {
        const onChange = () => setRevision(v => v + 1)
        window.addEventListener(EVENT, onChange)
        return () => window.removeEventListener(EVENT, onChange)
      }, [])
      return revision
    }

    const useAsync = (loader, deps) => {
      const [state, setState] = useState({ loading: true, data: null, error: null })
      useEffect(() => {
        let live = true
        setState({ loading: true, data: null, error: null })
        Promise.resolve().then(loader).then(
          data => { if (live) setState({ loading: false, data, error: null }) },
          error => { if (live) setState({ loading: false, data: null, error: String(error?.message || error) }) },
        )
        return () => { live = false }
      }, deps)
      return state
    }

    const iconUrl = entry => entry.icon
      ? entry.icon // official CDN URL (experts/skills from the official market)
      : (entry.hasIcon || entry.iconPath)
        ? `${API}/icon?kind=${entry.kind}&name=${encodeURIComponent(entry.name)}`
        : ''
    const zh = entry => entry.displayName || entry.name

    /** 召唤确认弹窗：WorkBuddy 在真正召唤前先让用户确认，并可顺手写下任务。 */
    function SummonDialog({ entry, busy, onCancel, onConfirm }) {
      const [task, setTask] = useState('')
      useEffect(() => {
        const onKey = event => { if (event.key === 'Escape') onCancel() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
      }, [onCancel])
      return h('div', { className: 'wbh-root wbh-modalRoot', role: 'dialog', 'aria-modal': 'true',
        'aria-label': `召唤 ${zh(entry)}` },
        h('style', null, STYLE),
        h('div', { className: 'wbh-modalScrim', onClick: onCancel }),
        h('div', { className: 'wbh-modal' },
          h('div', { className: 'wbh-modalHead' },
            h(Avatar, { entry, size: 36 }),
            h('div', { style: { minWidth: 0 } },
              h('h3', { className: 'wbh-modalTitle' }, `召唤 ${zh(entry)}`),
              h('p', { className: 'wbh-modalSub' }, '专家运行在独立会话中，主对话只接收结论'),
            ),
          ),
          h('p', { className: 'wbh-modalDesc' }, entry.description || entry.dir),
          h('textarea', {
            className: 'wbh-modalInput', rows: 3, value: task,
            placeholder: '可直接写下要交给这位专家的任务（留空则先确认角色）',
            'aria-label': '任务描述',
            onChange: event => setTask(event.target.value),
          }),
          h('div', { className: 'wbh-modalFoot' },
            h('button', { type: 'button', className: 'wbh-btnGhost', onClick: onCancel }, '取消'),
            h('button', {
              type: 'button', className: 'wbh-btnPrimary', disabled: busy,
              onClick: () => { void onConfirm(task) },
            }, busy ? '召唤中…' : '召唤专家'),
          ),
        ),
      )
    }

    /** 连接器授权：需要凭证时给出明确的授权步骤，必要时外跳授权页（新标签页）。 */
    function AuthDialog({ entry, refs, error, onClose, onRetry, busy, authDomain = '', retryable = true }) {
      const domain = authDomain !== '' ? authDomain : (entry?.cli?.authDomain ?? '')
      const authUrl = domain === '' ? '' : `https://${domain.replace(/^https?:\/\//, '')}`
      return h('div', { className: 'wbh-root wbh-modalRoot', role: 'dialog', 'aria-modal': 'true',
        'aria-label': `连接 ${zh(entry)}` },
        h('style', null, STYLE),
        h('div', { className: 'wbh-modalScrim', onClick: onClose }),
        h('div', { className: 'wbh-modal' },
          h('div', { className: 'wbh-modalHead' },
            h('span', { className: 'wbh-modalIcon' }, h(KindIcon, { kind: 'connector', size: 18 })),
            h('div', { style: { minWidth: 0 } },
              h('h3', { className: 'wbh-modalTitle' }, `连接 ${zh(entry)}`),
              h('p', { className: 'wbh-modalSub' }, '授权完成后回到本对话框重试'),
            ),
          ),
          h('p', { className: 'wbh-modalDesc' }, error || entry?.description || ''),
          refs.length === 0 && retryable === false && h('div', { className: 'wbh-authRow' },
            h(KindIcon, { kind: 'skill', size: 14 }),
            h('span', { className: 'wbh-authKey' }, 'CLI'),
            h('span', { style: { flex: 1 } }),
            h('span', { className: 'wbh-modalBadge' }, '技能已挂载'),
          ),
          refs.length > 0 && h('div', null,
            h('p', { className: 'wbh-modalSub', style: { marginBottom: 6 } }, '该连接器需要以下凭证'),
            refs.map(ref => h('div', { className: 'wbh-authRow', key: ref },
              h(KindIcon, { kind: 'connector', size: 14 }),
              h('span', { className: 'wbh-authKey' }, ref),
              h('span', { style: { flex: 1 } }),
              h('span', { className: 'wbh-modalBadge' }, '待配置'),
            )),
          ),
          h('p', { className: 'wbh-modalDesc' },
            authUrl === ''
              ? '凭证由 DSH 凭证管理持有；配置后点「重试连接」即可。'
              : `该连接器的授权入口在 ${domain}；点击「打开授权页」会新开标签页，授权后回来重试。`),
          h('div', { className: 'wbh-modalFoot' },
            h('button', { type: 'button', className: 'wbh-btnGhost', onClick: onClose }, '关闭'),
            authUrl !== '' && h('button', {
              type: 'button', className: 'wbh-btnGhost',
              onClick: () => { window.open(authUrl, '_blank', 'noopener') },
            }, h(WbIcon, { name: 'external', size: 13 }), h('span', null, '打开授权页')),
            retryable && h('button', {
              type: 'button', className: 'wbh-btnPrimary', disabled: busy,
              onClick: () => { void onRetry() },
            }, h(WbIcon, { name: 'refresh', size: 13 }), h('span', null, busy ? '连接中…' : '重试连接')),
          ),
        ),
      )
    }

    /** Connector affordance: labelled 连接 until connected, switch afterwards. */
    function ConnectorAction({ on, busy, onToggle }) {
      if (on) {
        return h('button', {
          type: 'button', className: 'wbh-switch on', role: 'switch', 'aria-checked': 'true',
          disabled: busy, title: '断开连接', onClick: onToggle,
        }, h('i', null))
      }
      return h('button', {
        type: 'button', className: 'wbh-connect', disabled: busy,
        title: '连接该连接器', onClick: onToggle,
      }, busy ? '连接中' : '连接')
    }

    function Avatar({ entry, size }) {
      const [failed, setFailed] = useState(false)
      const url = iconUrl(entry)
      const style = size ? { width: size, height: size } : undefined
      if (!url || failed) {
        return h('span', { className: 'wbh-avatar', style, 'aria-hidden': true }, h(KindIcon, { kind: entry.kind, size: 13 }))
      }
      return h('span', { className: 'wbh-avatar', style },
        h('img', { src: url, alt: '', loading: 'lazy', onError: () => setFailed(true) }))
    }

    /* ---------------- market menu (two-level) ---------------- */

    function MenuItem({ entry, installed, mounted, enabled, busy, onPrimary, onToggle }) {
      const isConnector = entry.kind === 'connector'
      const isExpert = entry.kind === 'expert'
      // A connector switch means "MCP is connected" (WorkBuddy semantics); for
      // experts and skills the chip/attach state is what the row reports.
      const on = isConnector ? enabled : mounted
      return h('button', {
        type: 'button', className: 'wbh-item', disabled: busy,
        onClick: () => { void (isConnector ? onToggle(entry) : onPrimary(entry)) },
        title: entry.description || entry.name,
      },
      h(Avatar, { entry: entry, size: 26 }),
      h('div', { className: 'wbh-itemBody' },
        h('div', { className: 'wbh-itemName' },
          h('span', null, zh(entry)),
          !installed && h('span', { className: 'wbh-tag' }, '未安装'),
          installed && !mounted && !isConnector && h('span', { className: 'wbh-tag' }, '已安装'),
        ),
        entry.description
          ? h('div', { className: 'wbh-itemDesc' }, entry.description)
          : h('div', { className: 'wbh-itemDesc' }, entry.dir),
      ),
      isConnector
        ? h(ConnectorAction, { on, busy, onToggle: () => { void onToggle(entry) } })
        : h('span', { className: `wbh-action${isExpert && !mounted ? ' primary' : ''}` },
            busy ? '…' : mounted ? '已挂载' : isExpert ? '召唤' : installed ? '挂载' : '添加'),
      )
    }

    /** Map an official market row to the entry shape the UI consumes. */
    function officialToEntry(r, kind) {
      const name = r.agent_name ?? r.name ?? r.id ?? r.skill_id ?? ''
      if (r.icon && typeof r.icon === 'string' && r.icon.startsWith('/')) {
        // official registry avatars are root-relative paths into the COS bucket
        r = { ...r, icon: 'https://acc-1258344699.cos.accelerate.myqcloud.com/workbuddy/expert-marketplace' + r.icon }
      }
      return {
        kind,
        name,
        displayName: r.display_name_zh || r.display_name_en || r.displayName || name,
        subtitle: r.profession_zh || r.profession_en || r.subtitle || '',
        description: r.description_zh || r.description || '',
        icon: r.icon || '',
        tags: (r.tags ?? []).map(t => (typeof t === 'string' ? t : t.zh || t.en)).filter(Boolean).slice(0, 3),
        hasMcpJson: kind === 'connector' && Boolean(r.mcp),
        hasCliJson: false,
        official: true,
      }
    }

    function MarketMenu({ sessionId, onClose, onOpenPanel }) {
      const [authorising, setAuthorising] = useState(null)
      const [summoning, setSummoning] = useState(null)
      const [kind, setKind] = useState('expert')
      const [query, setQuery] = useState('')
      const [busy, setBusy] = useState('')
      const [notice, setNotice] = useState('')
      const revision = useRevision()
      const installedState = useAsync(async () => (await api('/installed')).installed || {}, [revision])
      const mountedState = useAsync(async () => (
        sessionId ? (await api(`/mounted?sessionId=${encodeURIComponent(sessionId)}`)).keys || [] : []
      ), [sessionId, revision])
      const searchState = useAsync(async () => {
        // Official market first (logged-in gives the full 5.8k/9.1k catalogue);
        // the mirror remains the fallback and the package source.
        try {
          if (kind === 'expert') {
            // The official registry (no login needed) carries the zh/en copy,
            // tags, quick prompts and persona files for 428 experts.
            const r = await api(`/official-experts?limit=40&q=${encodeURIComponent(query)}`)
            const rows = (r.rows ?? []).map(row => officialToEntry(row, kind))
            if (rows.length) return rows
          }
          const r = await api(`/market-list?kind=${kind}&pageSize=40&q=${encodeURIComponent(query)}`)
          if (r.source === 'official' && (r.rows ?? []).length) return r.rows.map(row => officialToEntry(row, kind))
          if (r.source === 'official' && !r.rows?.length) return []
        } catch { /* fall through to the mirror */ }
        await api('/catalog')
        const result = await api(`/search?q=${encodeURIComponent(query)}&kind=${kind}s&limit=40`)
        return (result.hits || []).map(e => ({ ...e, official: false }))
      }, [kind, query, revision])
      const inputRef = useRef(null)

      useEffect(() => { inputRef.current?.focus() }, [])
      const installed = installedState.data || {}
      const mounted = new Set(mountedState.data || [])

      const attach = useCallback(async (entry, task = '') => {
        const key = `${entry.kind}/${entry.name}`
        setBusy(key); setNotice('')
        try {
          if (!installed[key]) {
            await post('/install', { kind: entry.kind, name: entry.name })
          }
          if (entry.kind === 'connector') {
            // Connect the real transport first: a connector that cannot reach
            // its endpoint must not look attached.
            const result = await post('/connectors/enable', { name: entry.name })
            if (sessionId) await post('/mount', { sessionId, kind: entry.kind, name: entry.name })
            setNotice(`已连接「${zh(entry)}」（工具命名空间 ${result.serverName}），下一次模型步骤起可用。`)
          } else if (entry.kind === 'expert') {
            if (sessionId) await post('/mount', { sessionId, kind: entry.kind, name: entry.name })
            // 召唤 mutates nothing in this conversation: the expert runs in its
            // own child session and only its conclusion comes back.
            const summoned = await runCommand(sessionId, `/expert ${entry.name}${task.trim() === '' ? '' : ` ${task.trim()}`}`)
            setNotice(summoned.ok
              ? `已召唤「${zh(entry)}」：${summoned.value?.text || '专家会话已创建'}`
              : `已挂载，但召唤失败：${summoned.error}`)
          } else {
            if (sessionId) await post('/mount', { sessionId, kind: entry.kind, name: entry.name })
            setNotice(`已挂载「${zh(entry)}」`)
          }
          notify()
        } catch (error) {
          const refs = error.body?.credentialRefs ?? []
          if (refs.length > 0) setAuthorising({ entry, refs, error: error.message })
          else setNotice(`失败：${error.message}`)
        } finally { setBusy('') }
      }, [installed, sessionId])

      const detach = useCallback(async entry => {
        const key = `${entry.kind}/${entry.name}`
        setBusy(key); setNotice('')
        try {
          if (entry.kind === 'connector') {
            // Switching off must tear the transport down, not just hide the chip.
            await post('/connectors/disable', { name: entry.name })
            setNotice(`已断开「${zh(entry)}」`)
          } else {
            setNotice(`已取消「${zh(entry)}」`)
          }
          if (sessionId) await post('/unmount', { sessionId, kind: entry.kind, name: entry.name })
          notify()
        } catch (error) {
          setNotice(`失败：${error.message}`)
        } finally { setBusy('') }
      }, [sessionId])

      const hits = searchState.data || []
      const footLabel = kind === 'expert' ? '召唤更多专家' : kind === 'skill' ? '从本地添加技能' : '管理连接器'

      return h('div', { className: 'wbh-root' },
        h('style', null, STYLE),
        h('div', { className: 'wbh-scrim', onClick: onClose }),
        h('div', { className: 'wbh-menu' },
          h('div', { className: 'wbh-menuCol' },
            KINDS.map(item => h('button', {
              key: item.id, type: 'button',
              className: `wbh-menuRow${kind === item.id ? ' on' : ''}`,
              onMouseEnter: () => setKind(item.id),
              onClick: () => setKind(item.id),
            },
            h('span', { className: 'wbh-menuRowIcon' }, h(KindIcon, { kind: item.id })),
            h('span', { className: 'wbh-menuRowLabel' }, item.label),
            h('span', { className: 'wbh-menuRowChev' }, h(WbIcon, { name: 'chevronRight', size: 14 })),
            )),
          ),
          h('div', { className: 'wbh-pane' },
            h('div', { className: 'wbh-paneHead' },
              h('span', { className: 'wbh-searchIcon' }, h(WbIcon, { name: 'search', size: 14 })),
              h('input', {
                ref: inputRef, className: 'wbh-search', value: query,
                placeholder: `搜索${kindOf(kind).label}`, 'aria-label': `搜索${kindOf(kind).label}`,
                onChange: event => setQuery(event.target.value),
              }),
            ),
            h('div', { className: 'wbh-paneList' },
              searchState.loading && h('div', { className: 'wbh-empty' }, '正在读取市场目录…'),
              searchState.error && h('div', { className: 'wbh-empty' }, `读取失败：${searchState.error}`),
              !searchState.loading && !searchState.error && hits.length === 0 &&
                h('div', { className: 'wbh-empty' }, '没有匹配的条目'),
              hits.map(entry => {
                const key = `${entry.kind}/${entry.name}`
                return h(MenuItem, {
                  key, entry,
                  installed: Boolean(installed[key]),
                  mounted: mounted.has(key),
                  enabled: installed[key]?.enabled === true,
                  busy: busy === key,
                  onPrimary: entry => setSummoning(entry),
                  onToggle: entry => mounted.has(key) ? detach(entry) : attach(entry),
                })
              }),
            ),
            h('div', { className: 'wbh-paneFoot', onClick: () => { onOpenPanel(); onClose() } },
              h('span', { 'aria-hidden': true }, '↗'), h('span', null, footLabel)),
            notice && h('div', { className: 'wbh-note', role: 'status' }, notice),
          ),
        ),
        summoning !== null && sessionId !== undefined && h(SummonDialog, {
          entry: summoning,
          busy: busy === `${summoning.kind}/${summoning.name}`,
          onCancel: () => setSummoning(null),
          onConfirm: async task => { await attach(summoning, task); setSummoning(null) },
        }),
        authorising !== null && h(AuthDialog, {
          entry: authorising.entry, refs: authorising.refs, error: authorising.error,
          authDomain: authorising.authDomain ?? '', retryable: authorising.retryable !== false,
          busy: busy === `${authorising.entry.kind}/${authorising.entry.name}`,
          onClose: () => setAuthorising(null),
          onRetry: async () => { await attach(authorising.entry); setAuthorising(null) },
        }),
      )
    }

    /* ---------------- composer "+" ---------------- */

    function ComposerAdd(props) {
      const [open, setOpen] = useState(false)
      const sessionId = props?.sessionId
      return h('div', { className: 'wbh-root wbh-anchor' },
        h('style', null, STYLE),
        h('button', {
          type: 'button', className: 'wbh-plus', 'aria-label': '专家·技能·连接器',
          'aria-expanded': open || undefined, title: '专家 · 技能 · 连接器',
          onClick: () => setOpen(v => !v),
        }, h(WbIcon, { name: 'plus', size: 14 })),
        open && h(MarketMenu, {
          sessionId,
          onClose: () => setOpen(false),
          onOpenPanel: () => {
            const select = props?.selectPanel
            if (typeof select === 'function') select('workbuddy-hub')
          },
        }),
      )
    }

    /* ---------------- attached rail below the composer ---------------- */

    function AttachedRail(props) {
      const sessionId = props?.sessionId
      const revision = useRevision()
      const [busy, setBusy] = useState('')
      const state = useAsync(async () => {
        if (!sessionId) return []
        return (await api(`/mounted?sessionId=${encodeURIComponent(sessionId)}`)).entries || []
      }, [sessionId, revision])
      const entries = state.data || []
      if (entries.length === 0) return null

      const detach = async entry => {
        const key = `${entry.kind}/${entry.name}`
        setBusy(key)
        try {
          await post('/unmount', { sessionId, kind: entry.kind, name: entry.name })
          notify()
        } finally { setBusy('') }
      }

      return h('div', { className: 'wbh-root wbh-rail', role: 'region', 'aria-label': '已挂载能力' },
        h('style', null, STYLE),
        entries.map(entry => {
          const key = `${entry.kind}/${entry.name}`
          return h('span', { className: 'wbh-railChip', key, title: `${kindOf(entry.kind).label}：${zh(entry)}` },
            h(Avatar, { entry }),
            h('span', { className: 'wbh-railName' }, zh(entry)),
            h('button', {
              type: 'button', className: 'wbh-railX', disabled: busy === key,
              'aria-label': `移除 ${zh(entry)}`, onClick: () => { void detach(entry) },
            }, busy === key ? '·' : '×'),
          )
        }),
      )
    }

    /* ---------------- global market page ---------------- */

    function MarketPanel({ kind, sessionId, onNotice }) {
      const [authorising, setAuthorising] = useState(null)
      const [summoning, setSummoning] = useState(null)
      const [query, setQuery] = useState('')
      const [busy, setBusy] = useState('')
      const revision = useRevision()
      const installedState = useAsync(async () => (await api('/installed')).installed || {}, [revision])
      const mountedState = useAsync(async () => (
        sessionId ? (await api(`/mounted?sessionId=${encodeURIComponent(sessionId)}`)).keys || [] : []
      ), [sessionId, revision])
      const searchState = useAsync(async () => {
        try {
          if (kind === 'expert') {
            const r = await api(`/official-experts?limit=60&q=${encodeURIComponent(query)}`)
            const rows = (r.rows ?? []).map(row => officialToEntry(row, kind))
            if (rows.length) return rows
          }
          const r = await api(`/market-list?kind=${kind}&pageSize=60&q=${encodeURIComponent(query)}`)
          if (r.source === 'official') return (r.rows ?? []).map(row => officialToEntry(row, kind))
        } catch { /* mirror fallback */ }
        await api('/catalog')
        const result = await api(`/search?q=${encodeURIComponent(query)}&kind=${kind}s&limit=60`)
        return result.hits || []
      }, [kind, query, revision])
      const installed = installedState.data || {}
      const mounted = new Set(mountedState.data || [])

      const act = async (entry, task = '') => {
        const key = `${entry.kind}/${entry.name}`
        setBusy(key)
        try {
          if (!installed[key]) await post('/install', { kind: entry.kind, name: entry.name })
          if (entry.kind === 'connector' && entry.hasCliJson === true && entry.hasMcpJson !== true) {
            // CLI 型连接器没有 MCP 传输：它的能力是随包挂载的技能，授权走外部页面。
            setAuthorising({
              entry, refs: [], retryable: false,
              authDomain: installed[key]?.cli?.authDomain ?? '',
              error: installed[key]?.cli?.needsAuth === true
                ? '该连接器通过命令行授权，完成后即可在本机使用其技能。'
                : '该连接器的技能已挂载。',
            })
            return
          }
          if (entry.kind === 'connector' && entry.hasCliJson === true && entry.hasMcpJson !== true) {
            setAuthorising({
              entry, refs: [], retryable: false,
              authDomain: installed[key]?.cli?.authDomain ?? '',
              error: installed[key]?.cli?.needsAuth === true
                ? '该连接器通过命令行授权，完成后即可在本机使用其技能。'
                : '该连接器的技能已挂载。',
            })
            return
          }
          if (entry.kind === 'connector') {
            // Connect the transport; the session attachment follows it so the
            // chip and the switch can never disagree with reality.
            if (installed[key]?.enabled === true) {
              await post('/connectors/disable', { name: entry.name })
              if (sessionId) await post('/unmount', { sessionId, kind: entry.kind, name: entry.name })
              onNotice?.(`已断开「${zh(entry)}」`)
            } else {
              const result = await post('/connectors/enable', { name: entry.name })
              if (sessionId) await post('/mount', { sessionId, kind: entry.kind, name: entry.name })
              onNotice?.(`已连接「${zh(entry)}」（工具命名空间 ${result.serverName}），下一次模型步骤起可用。`)
            }
          } else if (entry.kind === 'expert') {
            if (sessionId) await post('/mount', { sessionId, kind: entry.kind, name: entry.name })
            const summoned = await runCommand(sessionId, `/expert ${entry.name}${task.trim() === '' ? '' : ` ${task.trim()}`}`)
            onNotice?.(summoned.ok
              ? `已召唤「${zh(entry)}」：${summoned.value?.text || '专家会话已创建'}`
              : `已挂载，但召唤失败：${summoned.error}`)
          } else if (!sessionId) {
            onNotice?.(`已安装「${zh(entry)}」（进入对话后可挂载）`)
          } else if (mounted.has(key)) {
            await post('/unmount', { sessionId, kind: entry.kind, name: entry.name })
          } else {
            await post('/mount', { sessionId, kind: entry.kind, name: entry.name })
          }
          notify()
        } catch (error) {
          const refs = error.body?.credentialRefs ?? []
          if (refs.length > 0) setAuthorising({ entry, refs, error: error.message })
          else onNotice?.(`失败：${error.message}`)
        } finally { setBusy('') }
      }

      const hits = searchState.data || []
      return h('div', null,
        h('div', { className: 'wbh-panelHead' },
          h('span', { className: 'wbh-searchIcon' }, h(WbIcon, { name: 'search', size: 14 })),
          h('input', {
            className: 'wbh-search', value: query, placeholder: `搜索${kindOf(kind).label}`,
            onChange: event => setQuery(event.target.value),
          }),
        ),
        h('div', { className: 'wbh-grid' },
          searchState.loading && h('div', { className: 'wbh-empty' }, '正在读取市场目录…'),
          searchState.error && h('div', { className: 'wbh-empty' }, `读取失败：${searchState.error}`),
          !searchState.loading && !searchState.error && hits.length === 0 &&
            h('div', { className: 'wbh-empty' }, '没有匹配的条目'),
          hits.map(entry => {
            const key = `${entry.kind}/${entry.name}`
            const isConnector = entry.kind === 'connector'
            const isMounted = mounted.has(key)
            const isEnabled = installed[key]?.enabled === true
            const switchOn = isConnector ? isEnabled : isMounted
            return h('article', { className: 'wbh-card', key },
              h(Avatar, { entry: entry, size: 30 }),
              h('div', { className: 'wbh-itemBody' },
                h('div', { className: 'wbh-itemName' },
                  h('span', null, zh(entry)),
                  h('span', { className: 'wbh-tag' }, kindOf(entry.kind).label),
                  entry.hasMcpJson && h('span', { className: 'wbh-tag' }, 'MCP'),
                  entry.hasCliJson && h('span', { className: 'wbh-tag' }, 'CLI'),
                ),
                h('div', { className: 'wbh-itemDesc' }, entry.description || entry.dir),
                entry.flags?.length ? h('div', { className: 'wbh-flags' }, `⚠ ${entry.flags.length} 条安全扫描标记`) : null,
              ),
              isConnector
                ? h(ConnectorAction, { on: switchOn, busy: busy === key, onToggle: () => { void act(entry) } })
                : h('button', {
                    type: 'button', className: `wbh-action${isMounted ? '' : ' primary'}`,
                    disabled: busy === key,
                    onClick: () => { if (entry.kind === 'expert') setSummoning(entry); else void act(entry) },
                  }, busy === key ? '…' : isMounted ? '已挂载' : entry.kind === 'expert' ? '召唤' : '挂载'),
            )
          }),
        ),
        h('div', { className: 'wbh-note' },
          '安装与外部授权始终由你确认；专家只推荐与召唤，不会自动替换当前对话角色。'),
        summoning !== null && sessionId !== undefined && h(SummonDialog, {
          entry: summoning,
          busy: busy === `${summoning.kind}/${summoning.name}`,
          onCancel: () => setSummoning(null),
          onConfirm: async task => { await act(summoning, task); setSummoning(null) },
        }),
        authorising !== null && h(AuthDialog, {
          entry: authorising.entry, refs: authorising.refs, error: authorising.error,
          authDomain: authorising.authDomain ?? '', retryable: authorising.retryable !== false,
          busy: busy === `${authorising.entry.kind}/${authorising.entry.name}`,
          onClose: () => setAuthorising(null),
          onRetry: async () => { await act(authorising.entry); setAuthorising(null) },
        }),
      )
    }

    function HubPage(props) {
      const [kind, setKind] = useState('expert')
      const [notice, setNotice] = useState('')
      const health = useAsync(() => api('/health'), [])
      const sessionId = props?.sessionId
      return h('main', { className: 'wbh-root wbh-shell' },
        h('style', null, STYLE),
        h('div', { className: 'wbh-page' },
          h('header', { className: 'wbh-pageHead' },
            h('div', null,
              h('h1', { className: 'wbh-pageTitle' }, '专家 · 技能 · 连接器'),
              h('p', { className: 'wbh-pageSub' }, 'WorkBuddy 市场镜像 · 先浏览元数据，需要时才下载'),
            ),
            h('span', { className: 'wbh-stat' },
              h('i', { className: 'wbh-dot' }),
              health.error ? '服务不可用' : '市场已连接'),
          ),
          h(WbAuthBar, {}),
          h('div', { className: 'wbh-panel' },
            h('div', { className: 'wbh-tabs' },
              KINDS.map(item => h('button', {
                key: item.id, type: 'button', className: `wbh-tab${kind === item.id ? ' on' : ''}`,
                onClick: () => setKind(item.id),
              }, item.label)),
            ),
            h(MarketPanel, { kind, sessionId, onNotice: setNotice }),
          ),
          notice && h('p', { style: { marginTop: 10, fontSize: 12, color: 'var(--dsw-alias-label-secondary)' } }, notice),
        ),
      )
    }

    function HubPanelIcon({ size }) {
      return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
      },
      h('path', { d: 'M5 4.5h5.5V10H5zM13.5 4.5H19V10h-5.5zM5 13.5h5.5V19H5zM13.5 13.5H19V19h-5.5z' }),
      )
    }

    /** 添加腾讯账号 — workbuddy2api-style device-login card. Single account. */
    function WbAuthCard({ onClose, onDone }) {
      const [phase, setPhase] = useState('starting')
      const [authUrl, setAuthUrl] = useState('')
      const [qr, setQr] = useState('')
      const [error, setError] = useState('')
      const [nickname, setNickname] = useState('')
      const timer = useRef(null)
      useEffect(() => {
        let cancelled = false
        ;(async () => {
          try {
            const start = await post('/wb-auth/start', {})
            if (cancelled) return
            setAuthUrl(start.authUrl)
            if (typeof QRCode !== 'undefined') {
              QRCode.toDataURL(start.authUrl, { width: 320, margin: 1 }).then(d => { if (!cancelled) setQr(d) }).catch(() => {})
            }
            setPhase('waiting')
            const tick = async () => {
              if (cancelled) return
              try {
                const r = await post('/wb-auth/poll', {})
                if (cancelled) return
                if (r?.ok) { setNickname(r.nickname || ''); setPhase('done'); notify(); return }
              } catch (e) {
                if (e?.body && e.body.pending === false) { if (!cancelled) { setError(e.message); setPhase('error') } return }
              }
              timer.current = setTimeout(tick, 2500)
            }
            timer.current = setTimeout(tick, 2000)
          } catch (e) {
            if (!cancelled) { setError(e.message); setPhase('error') }
          }
        })()
        return () => { cancelled = true; if (timer.current) clearTimeout(timer.current) }
      }, [])
      const copy = async () => { try { await navigator.clipboard.writeText(authUrl) } catch { /* denied */ } }
      return h('div', { className: 'wbh-root wbh-modalRoot', role: 'dialog', 'aria-modal': 'true', 'aria-label': '添加腾讯账号' },
        h('style', null, STYLE),
        h('div', { className: 'wbh-modalScrim', onClick: onClose }),
        h('div', { className: 'wbh-authCard' },
          h('div', { className: 'wbh-authHead' },
            h('h3', { className: 'wbh-authTitle' }, '添加腾讯账号 · 国内版'),
            h('button', { type: 'button', className: 'wbh-authClose', onClick: onClose, 'aria-label': '关闭' }, '✕')),
          h('p', { className: 'wbh-authDesc' },
            '点开下方链接（或用微信 / QQ 扫码）在浏览器里完成授权，页面支持手机号登录；成功后会自动签到并纳管'),
          phase === 'starting' && h('div', { className: 'wbh-authWaiting' }, '正在向官方发起授权…'),
          phase === 'waiting' && [
            h('div', { className: 'wbh-authQr' }, qr ? h('img', { src: qr, alt: '授权二维码', width: 320, height: 320 }) : null),
            h('button', { type: 'button', className: 'wbh-authLink', onClick: () => { window.open(authUrl, '_blank', 'noopener') } }, '↗ ' + String(authUrl).slice(0, 72) + '…'),
            h('button', { type: 'button', className: 'wbh-authCopy', onClick: copy }, '⧉ 复制链接'),
            h('div', { className: 'wbh-authWaiting' }, '◌ 等待授权完成（打开链接在浏览器里登录，或扫码；手机号登录也可以）…'),
            h('button', { type: 'button', className: 'wbh-btnGhost wbh-authCancel', onClick: onClose }, '取消'),
          ],
          phase === 'done' && h('div', { className: 'wbh-authDone' },
            h('p', null, '已登录' + (nickname ? '：' + nickname : '') + '。官方市场数据已可用。'),
            h('button', { type: 'button', className: 'wbh-btnPrimary', onClick: onClose }, '完成')),
          phase === 'error' && h('div', { className: 'wbh-authDone' },
            h('p', { className: 'wbh-authError' }, '授权失败：' + error),
            h('button', { type: 'button', className: 'wbh-btnPrimary', onClick: onClose }, '关闭')),
        ),
      )
    }

    /** 官方账号状态条（市场页顶部）：未登录可直达扫码卡。 */
    function WbAuthBar() {
      const auth = useAsync(async () => api('/wb-auth'), [])
      const [open, setOpen] = useState(false)
      const loggedIn = auth.data?.configured === true
      return h('div', { className: 'wbh-authBar' },
        h('span', { className: 'wbh-authState' },
          h('i', { className: `wbh-dot${loggedIn ? '' : ' wbh-dotOff'}` }),
          loggedIn ? `官方账号已登录${auth.data?.nickname ? ' · ' + auth.data.nickname : ''}` : '官方账号未登录（技能/用量数据需登录）'),
        loggedIn
          ? h('button', { type: 'button', className: 'wbh-action', onClick: async () => { try { await post('/wb-auth/logout', {}) } catch {} notify() } }, '注销')
          : h('button', { type: 'button', className: 'wbh-action primary', onClick: () => setOpen(true) }, '扫码登录'),
        open && h(WbAuthCard, { onClose: () => { setOpen(false); notify() } }),
      )
    }

    function SettingsTab() {
      const revision = useRevision()
      const health = useAsync(() => api('/health'), [])
      const registry = useAsync(async () => api('/installed'), [revision])
      const auth = useAsync(async () => api('/wb-auth'), [revision])
      const [showAuth, setShowAuth] = useState(false)
      const entries = Object.values((registry.data?.installed) || {})
      const loggedIn = auth.data?.configured === true
      return h('section', { className: 'wbh-root wbh-settings' },
        h('style', null, STYLE),
        h('div', null,
          h('h2', { className: 'wbh-secTitle' }, '腾讯账号（官方市场数据）'),
          h('div', { className: 'wbh-row' },
            h('span', null, h('i', { className: `wbh-dot${loggedIn ? '' : ' wbh-dotOff'}` }),
              loggedIn
                ? `已登录${auth.data?.nickname ? ` · ${auth.data.nickname}` : ''}`
                : '未登录 — 官方专家/技能目录与用量数据需要登录'),
            loggedIn
              ? h('button', {
                  type: 'button', className: 'wbh-action',
                  onClick: async () => { try { await post('/wb-auth/logout', {}) } catch {} notify() },
                }, '注销')
              : h('button', { type: 'button', className: 'wbh-action primary', onClick: () => setShowAuth(true) }, '扫码登录'),
          ),
          loggedIn && h('div', { className: 'wbh-row' },
            h('span', { style: { fontSize: 11, color: 'var(--dsw-alias-label-tertiary)' } },
              `授权到期：${auth.data?.expiresAt ? new Date(auth.data.expiresAt).toLocaleString('zh-CN') : '—'}；token 到期前自动刷新`)),
        ),
        showAuth && h(WbAuthCard, { onClose: () => setShowAuth(false), onDone: () => notify() }),
        h('div', null,
          h('h2', { className: 'wbh-secTitle' }, 'WorkBuddy 市场状态'),
          h('div', { className: 'wbh-row' },
            h('span', null, h('i', { className: 'wbh-dot' }), health.error ? `服务异常：${health.error}` : `已连接 · ${health.data?.mirror || ''}`),
            h('span', { style: { fontSize: 11, color: 'var(--dsw-alias-label-tertiary)' } }, health.data?.store || ''),
          ),
        ),
        h('div', null,
          h('h2', { className: 'wbh-secTitle' }, `已安装（${entries.length}）`),
          entries.length === 0 && h('div', { className: 'wbh-empty' }, '在输入框 “＋” 或左侧入口浏览市场。'),
          entries.map(entry => h('div', { className: 'wbh-row', key: `${entry.kind}/${entry.name}` },
            h('span', null, `${kindOf(entry.kind).label} · ${entry.name}`,
              entry.flags?.length ? h('div', { className: 'wbh-flags' }, `⚠ ${entry.flags.length} 条扫描标记`) : null),
            h('span', { style: { fontSize: 11, color: 'var(--dsw-alias-label-tertiary)' } },
              `${entry.files || 0} 文件`
              + (entry.mcp ? ' · MCP' : '')
              + (entry.cli?.runtime ? ` · CLI(${entry.cli.runtime})` : '')
              + (entry.linkedSkills?.length ? ` · 技能 ${entry.linkedSkills.length}` : '')),
          )),
        ),
        h('p', { style: { margin: 0, fontSize: 12, lineHeight: 1.6, color: 'var(--dsw-alias-label-tertiary)' } },
          '需要 OAuth 或 API Key 的连接器会在启用时发起独立授权；本页与浏览器端不会展示任何凭据值。'),
      )
    }

    /* ---------------- registration ---------------- */

    // Only `slots` is a hard dependency: a wrong service name here would stop the
    // whole plugin from applying (the earlier "pending" failure). The remotes
    // MODULE is declared in dsh.client.inject, which guarantees it mounts its
    // namespaces before this bundle runs; the lookup stays lazy besides.
    exports.inject = ['slots']
    exports.apply = ctx => {
      pluginCtx = ctx
      ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: 'workbuddy-hub' }, HubPage))
      ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
        name: 'sidebar.panellist', id: 'workbuddy-hub', order: -90,
        label: () => '专家·技能·连接器',
      }, HubPanelIcon))
      ctx.slots.inject('conversation.input.left', () => ctx.slots.register({
        name: 'conversation.input.left', id: 'workbuddy-hub-add', order: -90,
        label: () => '专家·技能·连接器',
      }, ComposerAdd))
      // Never input.overlay: that surface floats INSIDE the card and would cover
      // the placeholder. The dock renders below the card (InputBar.tsx:484).
      ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
        name: 'conversation.composer.dock', id: 'workbuddy-hub-attached', order: -90,
        label: () => '已挂载 WorkBuddy 条目',
      }, AttachedRail))
      ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
        name: 'settings.plugins.tab', id: 'workbuddy-hub', order: 80,
        label: () => 'WorkBuddy 市场',
      }, SettingsTab))
      // A standalone settings SECTION guarantees a first-class nav entry even
      // where another plugin owns the plugins.tab strip.
      ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section', id: 'workbuddy-hub', order: 85,
        label: () => '专家·技能·连接器',
      }, SettingsTab))
    }

    return module.exports
  },
})
