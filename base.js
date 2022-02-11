function cross(A, B) {
  const result = [];
  for (const a of A) {
    for (const b of B) {
      result.push(a + b);
    }
  }
  return result;
}

const digits = '123456789';
const rows = 'ABCDEFGHI';
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
for (const rs of ['ABC', 'DEF', 'GHI']) {
  for (const cs of ['123', '456', '789']) {
    unitList.push(cross(rs, cs));
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
};
