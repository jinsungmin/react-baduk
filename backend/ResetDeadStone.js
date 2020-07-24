function ResetDeadStone(deadStone) {
  deadStone.blackStone = 0;
  deadStone.whiteStone = 0;

  //console.log('init:', deadStone.blackStone, deadStone.whiteStone);
  console.log('complete reset deadStone');
  return deadStone;
}

module.exports = ResetDeadStone;