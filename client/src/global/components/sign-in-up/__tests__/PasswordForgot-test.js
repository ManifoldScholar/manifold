import { PasswordForgotContainer } from "../PasswordForgot";

describe("global/components/sign-in-up/PasswordForgot", () => {
  def("handleViewChange", () => jest.fn());

  def("root", () => (
    <PasswordForgotContainer
      dispatch={$dispatch}
      handleViewChange={$handleViewChange}
      t={key => key}
    />
  ));
  def("wrapper", () => mount($withApp($root)));

  it("matches the snapshot", () => {
    expect(mount($withApp($root))).toMatchSnapshot();
  });

  it("should trigger handleViewChange callback when show login is clicked", () => {
    $handleViewChange.mockClear();
    $wrapper
      .find('[data-id="show-login"]')
      .first()
      .simulate("click");
    expect($handleViewChange).toHaveBeenCalled();
  });

  it("should trigger handleViewChange callback when show create is clicked", () => {
    $handleViewChange.mockClear();
    $wrapper
      .find('[data-id="show-create"]')
      .first()
      .simulate("click");
    expect($handleViewChange).toHaveBeenCalled();
  });
});
