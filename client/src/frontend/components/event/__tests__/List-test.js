import List from "../List";

describe("frontend/components/event/List", () => {
  def("events", () => collectionFactory("event"));
  def("project", () => factory("project"));
  def("root", () => <List project={$project} events={$events} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("renders a Tile for each event", () => {
    expect(render($withApp($root)).find("article").length).toBe(
      $events.length
    );
  });
});
