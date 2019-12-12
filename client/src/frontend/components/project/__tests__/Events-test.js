import Events from "../Events";

describe("frontend/components/project/Events", () => {
  def("events", () => collectionFactory("event"));
  def("project", () =>
    factory("project", { relationships: { events: $events } })
  );
  def("pagination", () => fixtures.pagination());
  def("root", () => (
    <Events project={$project} events={$events} pagination={$pagination} />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
