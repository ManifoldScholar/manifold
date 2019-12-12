import Filters from "../Filters";

describe("reader/components/notes/partial/Filters", () => {
  def("filter", () => ({ formats: ["highlight", "annotation", "bookmark"] }));
  def("filterChangeHandler", () => jest.fn());
  def("root", () => (
    <Filters filter={$filter} filterChangeHandler={$filterChangeHandler} />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
