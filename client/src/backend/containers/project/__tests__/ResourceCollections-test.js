import ResourceCollections from "../ResourceCollections";
import { project } from "./__fixtures__";

describe("backend/containers/project/ResourceCollections", () => {
  def("abilities", () => ({
    manageResourceCollections: true
  }));
  def("project", () => project($abilities));
  def("root", () => <ResourceCollections project={$project} t={key => key} />);
  def("user", () => factory("user"));

  beforeEach(() => {
    testHelpers.startSession($dispatch, $user);
  });

  afterEach(() => {
    testHelpers.endSession($dispatch);
  });

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value", () => {
    expect(render($withApp($root)).html()).not.toBeNull();
  });
});
