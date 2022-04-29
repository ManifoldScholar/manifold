import EventList from "../";

describe("frontend/containers/EventList/EventList", () => {
  def("events", () => collectionFactory("event"));
  def("project", () =>
    factory("project", { relationships: { events: $events } })
  );
  def("root", () => (
    <EventList
      project={$project}
      events={$events}
      eventsMeta={{ pagination: fixtures.pagination() }}
    />
  ));

  it("matches the snapshot", () => {
    expect(mount($withApp($root))).toMatchSnapshot();
  });
});
