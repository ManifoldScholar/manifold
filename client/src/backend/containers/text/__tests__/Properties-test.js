import TextPropertiesContainer from "../Properties";

describe("backend/containers/text/Properties", () => {
  def("creator", () => factory("maker"));
  def("contributor", () => factory("maker"));
  def("text", () =>
    factory("text", {
      relationships: { creators: [$creator], contributors: [$contributor] }
    })
  );
  def("root", () => <TextPropertiesContainer text={$text} />);

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
