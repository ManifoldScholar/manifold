import Group from "../Group";

describe("reader/components/notation/viewer/Group", () => {
  def("entries", () => [
    {
      height: 110,
      location: 715,
      annotation: factory("annotation"),
      notation: factory("resource")
    },
    {
      height: 110,
      location: 715,
      annotation: factory("annotation"),
      notation: factory("resource")
    }
  ]);
  def("makeActive", () => jest.fn());
  def("startDestroy", () => jest.fn());
  def("root", () => (
    <Group
      group={{ entries: $entries }}
      actions={{ makeActive: $makeActive, startDestroy: $startDestroy }}
      params={{ textId: "5", sectionId: "6" }}
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
