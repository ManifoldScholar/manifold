import Body from "../Body";

describe("reader/components/return-menu/Body", () => {
  def("project", () => factory("project"));
  def("toggleMock", () => jest.fn());
  def("root", () => (
    <Body
      returnUrl="/some/back/url"
      projectTitle={$project.attributes.title}
      toggleSignInUpOverlay={$toggleMock}
    />
  ));
  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
