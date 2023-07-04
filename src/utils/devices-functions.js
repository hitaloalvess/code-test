export const calcPositionDevice = ({ x, y, width, height, containerRef }) => {
  const deviceCenterWidth = width / 2;
  const deviceCenterHeight = height / 2;

  const scrollY = containerRef.current.scrollTop;
  const scrollX = containerRef.current.scrollLeft;

  return [
    (x - deviceCenterWidth) + scrollX,
    (y - deviceCenterHeight) + scrollY];
}

// DEVICE DHT
export const formulasForTransformation = {
  celsius: (temp) => {
    const convertedValue = Number(temp);
    return `${convertedValue.toFixed(2)} °C`;
  },
  fahrenheit: (temp) => {
    const convertedValue = (Number(temp) * (9 / 5)) + 32;
    return `${convertedValue.toFixed(2)} F`;
  },
  kelvin: (temp) => {
    const convertedValue = Number(temp) + 273.15;
    return `${(convertedValue).toFixed(2)} K`;
  }
}

export const transformHumidityValue = (value, maxValue) => {
  const percentage = Math.ceil((value * 100) / maxValue);

  return `${percentage} %`;
}
