import AppearanceMenuBody from "../AppearanceMenuBody";

describe("reader/components/control-menu/AppearanceMenuBody", () => {
  def("appearance", () => ({
    typography: {
      fontSize: {},
      margins: {}
    },
    colors: {}
  }));
  def("root", () => <AppearanceMenuBody appearance={$appearance} />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
