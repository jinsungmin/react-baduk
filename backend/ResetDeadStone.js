function ResetDeadStone(deadStone) {
  deadStone.blackStone = 0;
  deadStone.whiteStone = 0;
  
  return deadStone;
}

module.exports = ResetDeadStone;