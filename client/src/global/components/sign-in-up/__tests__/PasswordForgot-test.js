import PasswordForgotContainer from "../ForgotPasswordForm";

describe("global/components/sign-in-up/ForgotPasswordForm", () => {
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
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("should trigger handleViewChange callback when show login is clicked", () => {
    $handleViewChange.mockClear();
    $wrapper
      .find('button')
      .first()
      .simulate("click");
    expect($handleViewChange).toHaveBeenCalled();
  });

  it("should trigger handleViewChange callback when show create is clicked", () => {
    $handleViewChange.mockClear();
    $wrapper
      .find('button')
      .at(1)
      .simulate("click");
    expect($handleViewChange).toHaveBeenCalled();
  });
});
