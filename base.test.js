const { expect } = require('@jest/globals');
const { unitList, squares, units, peers } = require('./base');

test('There are 81 squares', () => {
  expect(squares.length).toBe(81);
});

test('There are 27 unit', () => {
  expect(unitList.length).toBe(27);
});

test('Every square is in 3 unit', () => {
  for (const unit of Object.values(units)) {
    expect(unit.length).toBe(3);
  }
});

test('Units of C2', () => {
  const unit = units['C2'];
  expect(unit.length).toBe(3);
  // prettier-ignore
  expect(unit[0]).toEqual(['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9']);
  // prettier-ignore
  expect(unit[1]).toEqual(['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2']);
  // prettier-ignore
  expect(unit[2]).toEqual(['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']);
});

test('All square has 20 peers', () => {
  for (const square of squares) {
    expect(peers[square].length).toBe(20);
  }
});

test('Peers of C2', () => {
  console.log(new Set(peers.C2));
  expect(new Set(peers.C2)).toEqual(
    new Set([
      'A2',
      'B2',
      'D2',
      'E2',
      'F2',
      'G2',
      'H2',
      'I2',
      'C1',
      'C3',
      'C4',
      'C5',
      'C6',
      'C7',
      'C8',
      'C9',
      'A1',
      'A3',
      'B1',
      'B3'
    ])
  );
});
