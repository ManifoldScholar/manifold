import CreateContainer from "../CreateUserForm";

describe("global/components/sign-in-up/CreateUserForm", () => {
  def("handleViewChange", () => jest.fn());
  def("user", () => factory("user"));
  def("pages", () => collectionFactory("page"));
  def("settings", () => factory("settings"));
  def("root", () => (
    <CreateContainer
      dispatch={$dispatch}
      handleViewChange={$handleViewChange}
      settings={$settings}
      pages={$pages}
      user={$user}
      t={key => key}
    />
  ));

  it("matches the snapshot", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("should trigger handleViewChange callback when show login is clicked", () => {
    const wrapper = mount($withApp($root));
    $handleViewChange.mockClear();
    wrapper
      .find('button')
      .last()
      .simulate("click");
    expect($handleViewChange).toHaveBeenCalled();
  });
});
