import { IngestionNewContainer } from "../New";
import { IngestionEditContainer } from "../Edit";

describe("backend/containers/project/text/ingestion/New", () => {
  def("project", () => factory("project"));
  def("history", () => fixtures.history());
  def("location", () => ({
    path: "/foo"
  }));
  def("root", () => (
    <IngestionNewContainer
      project={$project}
      history={$history}
      location={$location}
      t={key => key}
    />
  ));
  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
