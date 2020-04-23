import Video from "../Video";

describe("backend/components/resource/form/kind/Video", () => {
  def("kind", () => "kind");
  def("getModelValue", () => jest.fn(() => $kind));
  def("resource", () => factory("resource"));
  def("root", () => (
    <Video getModelValue={$getModelValue} sourceModel={$resource} />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  describe("when sub kind is external_video", () => {
    def("kind", () => "external_video");

    it("matches the snapshot when rendered", () => {
      expect(render($withApp($root)).html()).toMatchSnapshot();
    });
  });
});
