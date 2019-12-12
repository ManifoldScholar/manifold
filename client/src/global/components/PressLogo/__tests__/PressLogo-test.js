import PressLogo from "../";

describe("global/components/PressLogo/PressLogo", () => {
  context("when it has a URL", () => {
    def("root", () => <PressLogo url="some/url" />);
    it("matches the snapshot", () => {
      expect(shallow($root)).toMatchSnapshot();
    });
  });

  context("when it does not have a URL", () => {
    def("root", () => <PressLogo />);
    it("matches the snapshot", () => {
      expect(shallow($root)).toMatchSnapshot();
    });
  });
});
