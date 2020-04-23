import KindAttributes from "../KindAttributes";

describe("backend/components/resource/form/KindAttributes", () => {
  def("getModelValue", () => jest.fn(() => $resource.attributes.kind));
  def("resource", () => factory("resource", { attributes: { kind: $kind } }));
  def("root", () =>
    $withFormContext(<KindAttributes />, {
      sourceModel: $resource,
      getModelValue: $getModelValue
    })
  );

  [
    "audio",
    "document",
    "file",
    "image",
    "interactive",
    "link",
    "pdf",
    "presentation",
    "spreadsheet",
    "variants",
    "video"
  ].forEach(kind => {
    describe(`when the kind is ${kind}`, () => {
      def("kind", () => kind);

      it("matches the snapshot when rendered", () => {
        expect(render($withApp($root)).html()).toMatchSnapshot();
      });
    });
  });
});
