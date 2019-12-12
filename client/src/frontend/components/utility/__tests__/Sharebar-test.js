import ShareBar from "../ShareBar";

describe("frontend/components/utility/Sharebar", () => {
  def("settings", () => factory("settings"));
  def("root", () => (
    <ShareBar
      dispatch={$dispatch}
      label="The Label"
      url="the/url"
      message="The Message"
      settings={$settings}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
