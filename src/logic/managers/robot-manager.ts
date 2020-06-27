import { Robot } from '@/logic/classes/robot';
import { Square } from '@/logic/classes/square';

export function moveRobotToSquare(
  robot: Robot,
  toSquare: Square
  // unusedAmount = 1
) {
  if (toSquare.robots.length) {
    throw new Error('That square already contains a robot');
  }
  // Todo "Move" robot (simulate movement a little at a time), this is what 'amount', 'targetSquare', and 'position' are for
  const fromSquare = robot.sourceSquare;
  if (fromSquare) {
    const roboIndex = fromSquare.robots.indexOf(robot);
    if (roboIndex >= 0) {
      fromSquare.robots.splice(roboIndex, 1);
    }
  }
  toSquare.robots.push(robot);
  robot.sourceSquare = toSquare;
}
