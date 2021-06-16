import Layout from "frontend/components/layout";

describe("frontend/components/layout/ButtonNavigation", () => {
  def("root", () => <Layout.ButtonNavigation {...$props} />);

  it("matches the snapshot", () => {
    expect(render($withApp($root))).toMatchSnapshot();
  });

  context("when the grayBg prop is false", () => {
    def("props", () => ({ grayBg: false }));

    it("matches the snapshot", () => {
      expect(render($withApp($root))).toMatchSnapshot();
    });
  });

  context("when the showProjects prop is true", () => {
    def("props", () => ({ showProjects: false }));

    it("matches the snapshot", () => {
      expect(render($withApp($root))).toMatchSnapshot();
    });
  });

  context("when the showCollections prop is true", () => {
    def("props", () => ({ showCollections: false }));

    it("matches the snapshot", () => {
      expect(render($withApp($root))).toMatchSnapshot();
    });
  });
});
