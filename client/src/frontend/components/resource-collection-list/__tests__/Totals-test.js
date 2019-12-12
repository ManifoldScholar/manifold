import Totals from "../Totals";

describe("frontend/components/resource-collection-list/Totals", () => {
  def("project", () => factory("project"));
  def("root", () => <Totals count={$count} project={$project} />);

  describe("when the count is 3", () => {
    def("count", () => 3);
    it("matches the snapshot", () => {
      expect(shallow($root)).toMatchSnapshot();
    });
  });

  describe("when the count is null", () => {
    def("count", () => null);
    it("still renders the count", () => {
      expect(shallow($root).find('[data-id="count"]')).toHaveLength(1);
    });
  });
});
