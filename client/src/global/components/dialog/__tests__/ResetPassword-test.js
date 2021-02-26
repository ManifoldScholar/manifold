import ResetPassword, { ResetPasswordBase } from "../ResetPassword";

describe("backend/components/dialog/ResetPassword", () => {
  def("resolveMock", () => jest.fn());
  def("rejectMock", () => jest.fn());
  def("uiProps", () => ({
    heading: "Reset Password",
    message: "Pick a style, dawg.",
    reject: $rejectMock,
    resolve: $resolveMock
  }));
  def("root", () => <ResetPassword uiProps={$uiProps} />);

  it("matches the snapshot", () => {
    expect(render($withApp($root))).toMatchSnapshot();
  });
});
