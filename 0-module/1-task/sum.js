function sum(a, b) {
  if ([a, b].filter((item) => {
    return (typeof item == 'number' && item != NaN);
  }).length != 2) throw new TypeError();
  return a+b;
};

module.exports = sum;
