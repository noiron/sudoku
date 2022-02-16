const { digits, squares, peers, units, rows } = require('./base');

const grid1 = '3412123423414123';
const grid0 = '1..2............';
const grid2 =
  '1...34.8....8..5....4.6.....18......3..1.2..6.............7.9....6..9....9.64...2';
const grid3 =
`
. . . |. . 5 |. 8 . 
. . . |6 . 1 |. 4 3 
. . . |. . . |. . . 
------+------+------
. 1 . |5 . . |. . . 
. . . |1 . 6 |. . . 
3 . . |. . . |. . 5 
------+------+------
5 3 . |. . . |. 6 1 
. . . |. . . |. . 4 
. . . |. . . |. . . 
`
function parseGrid(grid) {
  // 开始时，每个格子都可以是任何数字，然后依次将 grid 中的数字分配给相应格子
  const values = {};
  for (const square of squares) {
    // 刚开始时，每个格子都可以分配所有的数字
    values[square] = digits;
  }

  for (const [square, digit] of Object.entries(gridValues(grid))) {
    if (digits.includes(digit)) {
      // 如果无法将 digit 分配给 square，说明无解
      if (!assign(values, square, digit)) return false;
    }
  }

  return values;
}

/**
 * Convert grid into a map of { square: char } with '0' or '.' for empties.
 */
function gridValues(grid) {
  let chars = '';
  for (const c of grid) {
    if (digits.includes(c) || c === '.' || c === '0') {
      chars += c;
    }
  }
  const map = {};
  for (let i = 0; i < squares.length; i++) {
    const square = squares[i];
    map[square] = chars[i];
  }
  return map;
}

// 约束传播的两种策略 constraint propagation
// 1. 如果一个格子只有唯一的可选数字，则从它的 peers 中删除这个数字
// 2. 如果一个 unit 中只有一个格子可以填入某一个数字，则将这个数字填入这个格子

/**
 * 将 digit 填入 square，在这个过程中执行约束传播
 */
function assign(values, square, digit) {
  // 将除 digit 以外的其他数字从 square 的备选数字中排除
  const otherValues = values[square].replace(digit, '');
  for (const d of otherValues) {
    // 在这个过程中，如果出现了矛盾，则返回 false
    if (!eliminate(values, square, d)) {
      return false;
    }
  }
  return values;
}

/**
 * 将 values[square] 中的 digit 删除
 */
function eliminate(values, square, digit) {
  // 这个数字已经排除了，则直接返回
  if (!values[square].includes(digit)) {
    return values;
  }

  values[square] = values[square].replace(digit, '');

  // 如果不存在可以填入的数字了，则无解
  if (values[square].length === 0) {
    return false;
  }

  // 这个格子只有唯一的可选数字，则从它的 peers 中删除这个数字
  if (values[square].length === 1) {
    for (const s of peers[square]) {
      if (!eliminate(values, s, values[square])) {
        return false;
      }
    }
  }

  // digit 已经从 square 中排除了，接下来找出 digit 可以填入的格子
  // 如果只有唯一的位置，则填入
  for (const unit of units[square]) {
    const digitPlaces = [];
    for (const s of unit) {
      if (values[s].includes(digit)) digitPlaces.push(s);
    }
    if (digitPlaces.length === 0) {
      return false;
    }
    if (digitPlaces.length === 1) {
      assign(values, digitPlaces[0], digit);
    }
  }

  return values;
}

function display(values) {
  let maxWidth = Math.max(...Object.values(values).map((v) => v.length));
  const strByRow = [];

  function generateRow(r) {
    let rowStr = '';
    for (const d of digits) {
      const value = values[r + d];
      const spaces = ' '.repeat(maxWidth - value.length + 1);
      rowStr += value + spaces;
      if (d === '3' || d === '6') {
        rowStr += '|';
      }
    }
    strByRow.push(rowStr);
  }

  // like this: ------+------+------
  const separatorItem = '-'.repeat((maxWidth + 1) * 3);
  const separator = new Array(3).fill(separatorItem).join('+');

  for (const r of rows) {
    generateRow(r);
    if (r === 'C' || r === 'F') {
      strByRow.push(separator);
    }
  }
  console.log(strByRow.join('\n'));
}

function solve(grid) {
  return search(parseGrid(grid));
}

/**
 * 如果一个格子可以填入超过一个的数字，则尝试填入这些数字，看是否可解
 */
function search(values) {
  if (!values) return false;

  const uncertainSquares = [];
  for (const square of squares) {
    if (values[square].length === 0) {
      return false;
    }
    if (values[square].length > 1) {
      uncertainSquares.push(square);
    }
  }
  if (uncertainSquares.length === 0) return values; // Solved

  // 先随便选一个格子，todo: 选择可能性最少的格子
  const square = uncertainSquares.find((s) => values[s].length > 1);

  for (const digit of values[square]) {
    const v = search(assign({ ...values }, square, digit));
    if (v) return v;
  }
  return false;
}

const result = solve(grid2);
display(parseGrid(grid2));
if (!result) console.log('No solution found');
else display(result);

module.exports = {
  solve,
  display,
};
