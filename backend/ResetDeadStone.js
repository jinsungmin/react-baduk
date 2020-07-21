async function ResetDeadStone(deadStone) {
  deadStone.blackStone = 0;
  deadStone.whiteStone = 0;

  console.log('init:', deadStone.blackStone, deadStone.whiteStone);

  return deadStone;
}

module.exports = ResetDeadStone;