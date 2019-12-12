import TextGeneralContainer from "../General";

describe("backend/containers/text/General", () => {
  def("creator", () => factory("maker"));
  def("contributor", () => factory("maker"));
  def("text", () =>
    factory("text", {
      relationships: { creators: [$creator], contributors: [$contributor] }
    })
  );
  def("root", () => <TextGeneralContainer text={$text} />);

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
