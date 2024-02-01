export const calcDistanceInvalidArea = ({
  sidebarRef, device
}) => {

  const {
    width: sidebarX,
    height: sidebarHeight,
  } = sidebarRef.current.getBoundingClientRect();

  const { posX: deviceX, posY: deviceY } = device;
  const isMobile = sidebarHeight < sidebarX ? true : false;

  if (!isMobile && deviceX < sidebarX) {
    const newConnectors = Object.values(device.connectors)
      .reduce((objConnectors, connector) => {

        return {
          ...objConnectors,
          [connector.name]: {
            ...connector,
            x: connector.x + sidebarX,
          }
        }

      }, {});

    return {
      ...device,
      posX: deviceX + sidebarX,
      posY: deviceY,
      connectors: { ...newConnectors }
    }
  }

  return device;

}
export const calcPositionDevice = ({ x, y, width, height, containerRef }) => {
  const deviceCenterWidth = width / 2;
  const deviceCenterHeight = height / 2;

  const scrollY = containerRef.current.scrollTop;
  const scrollX = containerRef.current.scrollLeft;

  return [
    (x - deviceCenterWidth) + scrollX,
    (y - deviceCenterHeight) + scrollY];
}

export const calcDimensionsDeviceArea = (devices) => {

  const maxDimensions = Object.values(devices).reduce((dimensions, device) => {

    const newWidth = Math.max(dimensions.width, device.posX);
    const newHeight = Math.max(dimensions.height, device.posY);

    return {
      width: newWidth,
      height: newHeight
    };
  }, { width: 0, height: 0 });

  return maxDimensions;
}

export const transformDeviceName = (name, tranformType) => {
  if(name.length === 0) return name;

  const types = {
    'firstLetterUpper': (name) => `${name.charAt(0).toUpperCase()}${name.slice(1)}`,
    'firstLetterLower': (name) => `${name.charAt(0).toLowerCase()}${name.slice(1)}`,
    'rm-space': (name) => name.replace(/\s/g, '').toLowerCase(),
    'rm-space-firstLower': (name) => {
      const nameWithoutSpace = types['rm-space'](name);
      const nameFirstLetterLower = types['firstLetterLower'](nameWithoutSpace);

      return nameFirstLetterLower;
    }
  }

  const selectTransformType = types[tranformType];

  return selectTransformType(name);
}

// DEVICE CLIMATE
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
