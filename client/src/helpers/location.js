import has from "lodash/has";
import get from "lodash/get";
import isString from "lodash/isString";
import startsWith from "lodash/startsWith";

class LocationHelper {
  equals(location, anotherLocation) {
    return location.key === anotherLocation.key;
  }

  unequal(location, anotherLocation) {
    return !this.equals(location, anotherLocation);
  }

  hashed(location) {
    return (
      has(location, "hash") && isString(location.hash) && location.hash !== ""
    );
  }

  preventsScroll(location) {
    const noScroll = get(location, "state.noScroll");
    if (noScroll === true) return true;
    return false;
  }

  triggersScrollToTop(location, previousLocation) {
    const unequal = this.unequal(location, previousLocation);
    const hashed = this.hashed(location);
    const scrollPrevented = this.preventsScroll(location);
    return unequal && !hashed && !scrollPrevented;
  }

  hashTypeMatch(location, hashType) {
    return startsWith(location.hash, `#${hashType}-`);
  }

  hashId(location, hashType) {
    return location.hash.substr(hashType.length + 2);
  }
}

export default new LocationHelper();
