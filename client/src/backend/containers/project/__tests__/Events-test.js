import { ProjectEventsContainer } from "../Events";
import { project, route } from "./__fixtures__";

describe("backend/containers/project/Events", () => {
  def("project", () => project($abilities));
  def("event", () => factory("event"));
  def("events", () => [$event]);
  def("pagination", () => fixtures.pagination());
  def("abilities", () => ({
    manageEvents: true
  }));

  def("root", () => (
    <ProjectEventsContainer
      project={$project}
      dispatch={$dispatch}
      events={$events}
      eventsMeta={{
        pagination: $pagination
      }}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value", () => {
    expect(render($withApp($root)).html()).not.toBeNull();
  });
});
