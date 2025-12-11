let _getStore = () => undefined;

export function setStoreGetter(fn) {
  _getStore = fn;
}

export function getClientIp() {
  return _getStore()?.clientIp;
}
