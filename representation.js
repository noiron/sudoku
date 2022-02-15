const { digits, squares, peers, units, rows } = require('./base');

const grid1 = '3412123423414123';
const grid0 = '1..2............';
const grid2 =
  '1...34.8....8..5....4.6.....18......3..1.2..6.............7.9....6..9....9.64...2';

function parseGrid(grid) {
  // 开始时，每个格子都可以是任何数字，然后依次将 grid 中的数字分配给相应格子
  const values = {};
  for (const square of squares) {
    values[square] = digits;
  }

  for (const [square, digit] of Object.entries(gridValues(grid))) {
    if (digits.includes(digit)) {
      if (!assign(values, square, digit)) return false;
    }
  }

  return values;
}

/**
 * Convert grid into a map of { square: char } with '0' or '.' for empties.
 */
function gridValues(grid) {
  const map = {};
  for (let i = 0; i < squares.length; i++) {
    const square = squares[i];
    map[square] = grid[i];
  }
  return map;
}

// 约束传播的两种策略
// 1. 如果一个格子只有唯一的可选数字，则从它的 peers 中删除这个数字
// 2. 如果一个 unit 中只有一个格子可以填入某一个数字，则将这个数字填入这个格子
// 这就被称为 constraint propagation - 约束传播

function assign(values, square, digit) {
  // 将除了 digit 以外的数字都从 values[square] 中删除
  const otherValues = values[square].replace(digit, '');
  for (const d2 of otherValues) {
    if (!eliminate(values, square, d2)) {
      return false;
    }
  }
  return values;
}

/**
 * 将 values[square] 中的 digit 删除
 */
function eliminate(values, square, digit) {
  if (!values[square].includes(digit)) {
    return;
  }

  values[square] = values[square].replace(digit, '');

  // 如果不存在可以填入的数字了，一定有问题
  if (values[square].length === 0) {
    return false;
  }

  // 一个格子只有唯一的可选数字，则从它的 peers 中删除这个数字
  if (values[square].length === 1) {
    for (const s of peers[square]) {
      eliminate(values, s, values[square]);
    }
  }

  // 找出 digit 可以填入的 square
  for (const u of units[square]) {
    const digitPlaces = [];
    for (const s of u) {
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
  let maxWidth = 10;
  for (const r of rows) {
    let row = r + '\t';
    for (const d of digits) {
      const value = values[r + d];
      const spaces = new Array(maxWidth - value.length + 1).fill(' ').join('');
      row = row + value + spaces;
    }
    console.log(row + '\n');
  }
}

function solve(grid) {
  return search(parseGrid(grid));
}

function search(values) {
  if (!values) return false;

  const uncertainSquares = [];
  for (const square of squares) {
    if (values[square].length !== 1) {
      uncertainSquares.push(square);
    }
  }
  if (uncertainSquares.length === 0) return values; // Solved

  // 先随便选一个格子
  const square = uncertainSquares.find((s) => values[s].length > 1);
  if (!square) return false;

  for (const d of values[square]) {
    const v = search(assign({ ...values }, square, d));
    if (v) return v;
  }
  return false;
}

const v = solve(grid2);
if (!v) console.log('No solution found');
else display(v);
