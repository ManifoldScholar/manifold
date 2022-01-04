import Pagination from "../Pagination";

describe("global/components/utility/Pagination", () => {
  def("pageChangeMock", () => jest.fn());
  def("fakeDomEvent", () => ({
    stopPropagation: () => undefined,
    preventDefault: () => undefined
  }));
  def("root", () => (
    <Pagination
      pagination={fixtures.pagination()}
      paginationClickHandler={() => $pageChangeMock}
    />
  ));
  def("wrapper", () => mount($withApp($root)));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });

  context("when there are no pagination props", () => {
    def("root", () => (
      <Pagination paginationClickHandler={() => $pageChangeMock} />
    ));

    it("renders to null", () => {
      expect(shallow($root)).toMatchSnapshot();
    });
  });

  context("when it is compact", () => {
    def("root", () => (
      <Pagination
        pagination={fixtures.pagination()}
        paginationClickHandler={() => $pageChangeMock}
        compact
      />
    ));

    it("matches the snapshot", () => {
      expect(shallow($root)).toMatchSnapshot();
    });
  });
});
