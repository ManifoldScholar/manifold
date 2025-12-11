import * as cookie from "cookie";

export default class ServerCookie {
  constructor(request) {
    this.request = request;
  }

  get parsed() {
    const cookieHeader = this.request.headers.get("cookie") || "";
    return cookie.parse(cookieHeader);
  }

  read(key) {
    return this.parsed[key];
  }

  adjustedOptions(options) {
    const out = { ...options };
    if (out.expires && typeof out.expires === "number") {
      out.expires = new Date(new Date() * 1 + out.expires * 864e5);
    }
    return out;
  }
}
