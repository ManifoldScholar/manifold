import Filters from "../Filters";

describe("reader/components/notes/partial/Filters", () => {
  def("filters", () => ({ formats: ["highlight", "annotation", "bookmark"] }));
  def("filterChangeHandler", () => jest.fn());
  def("root", () => (
    <Filters filters={$filters} filterChangeHandler={$filterChangeHandler} />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
