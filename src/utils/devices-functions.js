export const calcPositionDevice = ({ x, y, width, height }) => {
  const deviceCenterWidth = width / 2;
  const deviceCenterHeight = height / 2;

  const scrollY = document.documentElement.scrollTop;
  const scrollX = document.documentElement.scrollLeft;

  //REALIZAR VALIDACAO PARA NAO POSICIONAR EM AREA INVALIDA


  return [
    (x - deviceCenterWidth) + scrollX,
    (y - deviceCenterHeight) + scrollY];
}
