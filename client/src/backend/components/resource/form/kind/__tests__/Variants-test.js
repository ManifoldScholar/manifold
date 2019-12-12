import Variants from "../Variants";

describe("backend/components/resource/form/kind/Variants", () => {
  def("kind", () => "file");
  def("root", () => <Variants kind={$kind} />);

  it("matches the snapshot when rendered", () => {
    expect(render($root)).toMatchSnapshot();
  });

  describe("when kind is image", () => {
    def("kind", () => "image");
    it("matches the snapshot when rendered", () => {
      expect(render($root)).toMatchSnapshot();
    });
  });

  describe("when kind is pdf", () => {
    def("kind", () => "pdf");
    it("matches the snapshot when rendered", () => {
      expect(render($root)).toMatchSnapshot();
    });
  });
});
