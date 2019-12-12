import Login from "../Login";
import CreateUpdate from "../CreateUpdate";

describe("global/components/sign-in-up/Login", () => {
  def("user", () => factory("user"));
  def("authentication", () =>
    fixtures.authentication({ user: $user })
  );
  def("handleViewChange", () => jest.fn());
  def("settings", () => factory("settings"));
  def("root", () => (
    <Login
      dispatch={$dispatch}
      handleViewChange={$handleViewChange}
      user={$user}
      authentication={$authentication}
      settings={$settings}
    />
  ));
  def("wrapper", () => mount($withApp($root)));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });

  it("should trigger handleViewChange callback when show forgot is clicked", () => {
    $handleViewChange.mockClear();
    $wrapper
      .find('[data-id="show-forgot"]')
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
