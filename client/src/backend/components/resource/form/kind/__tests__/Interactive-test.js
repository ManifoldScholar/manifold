import Interactive from "../Interactive";

describe("backend/components/resource/form/kind/Interactive", () => {
  def("getModelValue", () => jest.fn(() => $subKind));
  def("root", () => <Interactive getModelValue={$getModelValue} />);

  describe("when sub kind is embed", () => {
    def("subkind", () => "embed");
    it("matches the snapshot", () => {
      expect(shallow($root)).toMatchSnapshot();
    });
  });

  describe("when sub kind is iframe", () => {
    def("subkind", () => "iframe");
    it("matches the snapshot", () => {
      expect(shallow($root)).toMatchSnapshot();
    });
  });
});
