function deepClone(input) {
  if(input !== null && typeof input === 'object') {
    const clone = input.constructor();
    for(const key in input) {
      clone[key] = deepClone(input[key]);
    }
    return clone;
  }
  return input;
}