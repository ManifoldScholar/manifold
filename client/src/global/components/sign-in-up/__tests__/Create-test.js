import { CreateContainer } from "../Create";

describe("global/components/sign-in-up/Create", () => {
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
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });

  it("should trigger handleViewChange callback when show login is clicked", () => {
    const wrapper = mount($withApp($root));
    $handleViewChange.mockClear();
    wrapper
      .find('[data-id="show-login"]')
      .first()
      .simulate("click");
    expect($handleViewChange).toHaveBeenCalled();
  });
});
