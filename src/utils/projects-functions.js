export const replaceFuncInString = (key, value) => {
  if (typeof value === 'function') {
    return { _isFunction: true, body: value.toString() }; //Convert func for string
  }

  return value;
}

export const replaceStringInFunc = (key, value) => {
  if (value && typeof value === 'object' && value._isFunction && value.body) {
    return new Function(`return ${value.body}`)();
  }

  return value;
}

export const removeHTMLElementRef = (objElement) => {
  const newObj = Object.entries(objElement).reduce((acc, value) => {
    const objkey = value[0];
    const objValue = value[1];

    if (objValue?.current instanceof Element ||
      objValue instanceof Function || objValue instanceof Element) {
      return acc;
    }

    return {
      ...acc,
      [objkey]: objValue
    }
  }, {});


  return newObj;
}
