import Button from "../menu/Button";

describe("global/components/search/button", () => {
  context("when it isn't active", () => {
    def("root", () => <Button active={false} toggleSearchMenu={() => {}} />);

    it("matches the snapshot", () => {
      expect(shallow($root)).toMatchSnapshot();
    });
  });

  context("when it is active", () => {
    def("root", () => <Button active={true} toggleSearchMenu={() => {}} />);

    it("matches the snapshot", () => {
      expect(shallow($root)).toMatchSnapshot();
    });
  });
});
