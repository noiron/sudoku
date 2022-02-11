const { digits, squares, peers, units } = require('./base');

const grid1 = '3412123423414123';
const grid0 = '3..2......4...2.';

function parseGrid(grid) {
  // 开始时，每个格子都可以是任何数字，然后依次将 grid 中的数字分配给相应格子
  const values = {};
  for (const square of squares) {
    values[square] = digits;
  }
  console.log('每个格子都可以是任何数字: ', values);

  for (const [square, digit] of Object.entries(gridValues(grid))) {
    if (digits.includes(digit)) {
      assign(values, square, digit);
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

const a = parseGrid(grid0);
console.log('a: ', a);

// 两种策略
// 1. 如果一个格子只有唯一的可选数字，则从它的 peers 中删除这个数字
// 2. 如果一个 unit 中只有一个格子可以填入某一个数字，则将这个数字填入这个格子
// 这就被称为 constraint propagation - 约束传播

function assign(values, square, digit) {
  // 将除了 digit 以外的数字都从 values[square] 中删除
  const otherValues = values[square].replace(digit, '');
  for (const d2 of otherValues) {
    eliminate(values, square, d2);
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
