export const calcPositionDevice = ({ x, y, width, height, containerRef }) => {
  const deviceCenterWidth = width / 2;
  const deviceCenterHeight = height / 2;

  const scrollY = containerRef.current.scrollTop;
  const scrollX = containerRef.current.scrollLeft;

  //REALIZAR VALIDACAO PARA NAO POSICIONAR EM AREA INVALIDA


  return [
    (x - deviceCenterWidth) + scrollX,
    (y - deviceCenterHeight) + scrollY];
}
