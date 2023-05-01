import { ProjectNewContainer } from "../New";
import { project } from "./__fixtures__";
import ProjectMetadataContainer from "../Metadata";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";

describe("backend/containers/project/New", () => {
  beforeEach(() => {
    testHelpers.startSession($dispatch, $user);
  });
  def("user", () =>
    factory("user", {
      attributes: {
        abilities: {
          project: {
            create: true
          }
        }
      }
    })
  );
  def("root", () => <BreadcrumbsProvider><ProjectNewContainer t={key => key}/></BreadcrumbsProvider>);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value", () => {
    expect(render($withApp($root)).html()).not.toBeNull();
  });
});
