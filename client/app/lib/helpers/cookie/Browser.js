import cookie from "js-cookie";

export default class BrowserCookie {
  write(key, value, options = { path: "/", expires: 90 }) {
    cookie.set(key, value, options);
  }

  read(key) {
    return cookie.get(key);
  }

  remove(key, options = { path: "/", expires: 90 }) {
    return cookie.remove(key, options);
  }
}
