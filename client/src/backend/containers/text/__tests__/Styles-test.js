import TextStylesContainer from "../Stylesheets";

describe("backend/containers/text/Styles", () => {
  def("stylesheets", () => collectionFactory("stylesheet"));
  def("text", () =>
    factory("text", { relationships: { stylesheets: $stylesheets } })
  );
  def("root", () => <TextStylesContainer text={$text} t={key => key} />);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
