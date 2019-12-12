import currentUserMiddleware from "../currentUserMiddleware";
import BrowserCookie from "helpers/cookie/Browser";
import tokensApi from "api/resources/tokens";

jest.mock("api/resources/tokens");
jest.mock("helpers/cookie/Browser");

xdescribe("store/middleware/currentUserMiddleware", () => {
  const dispatch = jest.fn();
  const getState = jest.fn();
  const next = jest.fn();
  const subject = currentUserMiddleware({ dispatch, getState })(next);

  describe("when the token request is successful", () => {
    tokensApi.createToken.mockImplementation(() => {
      const promise = Promise.resolve({
        meta: {
          authToken: "foo"
        }
      });
      return promise;
    });

    it("sets a cookie on login with password", () => {
      subject({
        type: "LOGIN",
        payload: { email: "e@e.com", password: "foo" }
      });
      return tokensApi.createToken().finally(() => {
        const cookieInstance = BrowserCookie.mock.instances[0];
        expect(cookieInstance.write).toHaveBeenCalled();
        BrowserCookie.mockReset();
      });
    });

    it("sets a cookie on login with auth token", () => {
      subject({ type: "LOGIN", payload: { authToken: "foo" } });
      return tokensApi.createToken().finally(() => {
        const cookieInstance = BrowserCookie.mock.instances[0];
        expect(cookieInstance.write).toHaveBeenCalled();
        BrowserCookie.mockReset();
      });
    });
  });

  // This mock is interfering with the other tests; Will circle back to fix.

  // describe("when the login request is not successful", () => {
  //
  //   tokensApi.createToken.mockImplementation(() => {
  //     const promise = Promise.reject({ status: 500 });
  //     return promise;
  //   });
  //
  //   it("destroys the cookie on failed password authentication", () => {
  //     return new Promise((resolve, reject) => {
  //       subject({ type: "LOGIN", payload: { email: "e@e.com", password: "foo" } });
  //       tokensApi.createToken().catch(() => {
  //         const cookieInstance = BrowserCookie.mock.instances[0];
  //         expect(cookieInstance.remove).toHaveBeenCalled();
  //         BrowserCookie.mockReset()
  //         resolve();
  //       });
  //     })
  //   });
  //
  // });

  describe("when the user logs out", () => {
    it("destroys the cookie", () => {
      subject({ type: "LOGOUT" });
      const cookieInstance = BrowserCookie.mock.instances[0];
      expect(cookieInstance.remove).toHaveBeenCalled();
      BrowserCookie.mockReset();
    });
  });
});
