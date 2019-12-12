import ProjectMetadataContainer from "../Metadata";
import { project } from "./__fixtures__";

describe("backend/containers/project/Metadata", () => {
  beforeEach(() => {
    testHelpers.startSession($dispatch, $user);
  });
  def("abilities", () => ({ update: true }));
  def("user", () => factory("user"));
  def("project", () => project($abilities));
  def("root", () => <ProjectMetadataContainer project={$project} />);

  it("matches the snapshot when mounted", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value after mounting", () => {
    expect(mount($withApp($root)).html()).not.toBeNull();
  });
});
