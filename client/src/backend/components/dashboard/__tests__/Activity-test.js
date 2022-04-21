import Activity from "../Activity";

describe("backend/components/dashboard/Activity", () => {
  def("stats", () => factory("statistics"));
  def("root", () => <Activity statistics={$stats} />);

  def("googleStatNodes", () => [
    <span>Readers this week</span>,
    <span>Change from last week</span>
  ]);

  describe("when all stats are present", () => {
    it("matches the snapshot", () => {
      expect(render($root)).toMatchSnapshot();
    });

    it("renders google stats", () => {
      expect(
        mount($withApp($root)).containsAnyMatchingElements($googleStatNodes)
      ).toEqual(true);
    });
  });

  describe("when google fields are not present", () => {
    def("stats", () =>
      factory("statistics", {
        attributes: {
          readerIncrease: null,
          readersThisWeek: null
        }
      })
    );

    it("does not render google stats", () => {
      expect(
        shallow($root).containsAnyMatchingElements($googleStatNodes)
      ).toEqual(false);
    });
  });

  describe("when no stats are present", () => {
    def("stats", () => null);
    it("returns nothing", () => {
      expect(shallow($root).html()).toBe("");
    });
  });
});
