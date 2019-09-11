import cookie from "cookie";

export default class ServerCookie {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  get parsed() {
    return cookie.parse(this.req.headers.cookie || "");
  }

  write(key, value, options = { path: "/", expires: 90 }) {
    this.res.setHeader(
      "Set-Cookie",
      cookie.serialize(key, value, this.adjustedOptions(options))
    );
  }

  read(key) {
    const parsed = this.parsed;
    return parsed[key];
  }

  remove(key, options = { path: "/", expires: new Date(1970, 1, 1) }) {
    return this.write(key, "", this.adjustedOptions(options));
  }

  adjustedOptions(options) {
    const out = { ...options };
    if (out.expires) {
      out.expires = new Date(new Date() * 1 + out.expires * 864e5);
    }
    return out;
  }
}
