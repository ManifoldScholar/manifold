import List from "../List";

describe("frontend/components/event/List", () => {
  def("events", () => collectionFactory("event"));
  def("project", () => factory("project"));
  def("root", () => <List project={$project} events={$events} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });

  it("has the event-list class", () => {
    expect(
      shallow($root)
        .find("ul")
        .is(".event-list")
    ).toBe(true);
  });

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("renders a Tile for each event", () => {
    expect(render($withApp($root)).find(".event-tile").length).toBe(
      $events.length
    );
  });
});
