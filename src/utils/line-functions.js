const calcDelta = ({ x1, y1, x2, y2 }) => {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  return [deltaX, deltaY];
}
export const calcAngle = ({ x1, y1, x2, y2 }) => {
  const [deltaX, deltaY] = calcDelta({ x1, y1, x2, y2 });
  return Math.atan2(deltaY, deltaX) * 180 / Math.PI;
}

export const calcDistance = ({ x1, y1, x2, y2 }) => {
  const [deltaX, deltaY] = calcDelta({ x1, y1, x2, y2 });
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}
