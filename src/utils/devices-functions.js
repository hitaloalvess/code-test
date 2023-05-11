export const calcPositionDevice = ({ x, y, width, height }) => {
  const deviceCenterWidth = width / 2;
  const deviceCenterHeight = height / 2;

  //REALIZAR VALIDACAO PARA NAO POSICIONAR EM AREA INVALIDA


  return [(x - deviceCenterWidth), (y - deviceCenterHeight)];
}
