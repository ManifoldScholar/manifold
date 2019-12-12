import { IngestionEditContainer } from "../Edit";

describe("backend/containers/project/text/ingestion/Edit", () => {
  def("project", () => factory("project"));
  def("history", () => fixtures.history());
  def("location", () => ({
    path: "/foo"
  }));
  def("root", () => (
    <IngestionEditContainer
      project={$project}
      history={$history}
      location={$location}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
