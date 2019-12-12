import Filters from "../Filters";

describe("frontend/components/resource-list/Filters", () => {
  def("tags", () => ["dog", "puppy"]);
  def("kinds", () => ["image", "video"]);
  def("filterChange", () => jest.fn());
  def("root", () => (
    <Filters
      tags={$tags}
      kinds={$kinds}
      filterChangeHandler={$filterChange}
      initialFilterState={{}}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
