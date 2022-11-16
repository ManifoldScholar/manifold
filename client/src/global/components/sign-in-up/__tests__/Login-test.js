import Login from "../LoginForm";
import CreateUpdate from "../EditProfileForm";

describe("global/components/sign-in-up/LoginForm", () => {
  def("user", () => factory("user"));
  def("authentication", () => fixtures.authentication({ user: $user }));
  def("handleViewChange", () => jest.fn());
  def("settings", () => factory("settings"));
  def("root", () => (
    <Login
      dispatch={$dispatch}
      handleViewChange={$handleViewChange}
      user={$user}
      authentication={$authentication}
      settings={$settings}
      t={key => key}
    />
  ));
  def("wrapper", () => mount($withApp($root)));

  it("matches the snapshot", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("should trigger handleViewChange callback when show forgot is clicked", () => {
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
