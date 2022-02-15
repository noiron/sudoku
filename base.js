function cross(A, B) {
  const result = [];
  for (const a of A) {
    for (const b of B) {
      result.push(a + b);
    }
  }
  return result;
}

// 开发时，使用 4x4 的格子方便测试
const DIMENSION = 9;

let digits = '123456789';
let rows = 'ABCDEFGHI';
if (DIMENSION === 4) {
  digits = '1234';
  rows = 'ABCD';
}

const cols = digits;
const squares = cross(rows, digits);

const unitList = [];
// 所有的行
for (const row of rows) {
  unitList.push(cross(row, cols));
}
// 所有的列
for (const col of cols) {
  unitList.push(cross(rows, col));
}
// 所有的九宫格
if (DIMENSION === 9) {
  for (const rs of ['ABC', 'DEF', 'GHI']) {
    for (const cs of ['123', '456', '789']) {
      unitList.push(cross(rs, cs));
    }
  }
} else if (DIMENSION === 4) {
  for (const rs of ['AB', 'CD']) {
    for (const cs of ['12', '34']) {
      unitList.push(cross(rs, cs));
    }
  }
}

const units = {};
for (const square of squares) {
  units[square] = [];
  for (const unit of unitList) {
    if (unit.includes(square)) {
      units[square].push(unit);
    }
  }
}

const peers = {};
for (const square of squares) {
  const squarePeers = new Set();
  for (const unit of units[square]) {
    for (const peer of unit) {
      if (peer !== square) {
        squarePeers.add(peer);
      }
    }
  }
  peers[square] = Array.from(squarePeers);
}

module.exports = {
  squares,
  unitList,
  units,
  peers,
  digits,
  rows,
};
