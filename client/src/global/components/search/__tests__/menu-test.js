import SearchMenu from "global/components/search/menu";

describe("global/components/search/menu", () => {
  def("history", () => jest.fn());
  def("match", () => jest.fn());
  def("toggleVisibility", () => jest.fn());
  def("root", () => (
    <SearchMenu.Body
      visibility={{ search: $searchVisible }}
      searchType="reader"
      history={$history}
      match={$match}
      toggleVisibility={$toggleVisibility}
    />
  ));

  context("when search is visible", () => {
    def("searchVisible", () => true);
    it("matches the snapshot", () => {
      expect(shallow($root)).toMatchSnapshot();
    });
  });

  context("when search is not visible", () => {
    def("searchVisible", () => false);
    it("matches the snapshot", () => {
      expect(shallow($root)).toMatchSnapshot();
    });
  });
});
