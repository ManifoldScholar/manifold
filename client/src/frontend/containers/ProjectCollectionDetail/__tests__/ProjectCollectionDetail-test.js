import ProjectCollectionDetailContainer from "../";
import useSetLocation from "hooks/useSetLocation";

jest.mock("hooks/useSetLocation", () => () => null);

describe("frontend/containers/ProjectCollectionDetail/ProjectCollectionDetail", () => {
  def("root", () => (
    <ProjectCollectionDetailContainer
    />
  ));
  it("matches the snapshot", () => {
    expect(mount($withApp($root))).toMatchSnapshot();
  });
});
