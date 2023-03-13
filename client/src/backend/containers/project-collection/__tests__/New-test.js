import ProjectCollectionNew from "../New";

describe("backend/containers/project-collection/New", () => {
  beforeEach(() => {
    testHelpers.startSession($dispatch, $user);
  });
  def("user", () =>
    factory("user", {
      attributes: {
        abilities: {
          projectCollection: {
            create: true
          }
        }
      }
    })
  );

  def("root", () => (
    <ProjectCollectionNew
      dispatch={$dispatch}
      buildUpdateProjectCollection={jest.fn}
      buildCreateProjectCollection={jest.fn}
      successHandler={jest.fn}
      setDirty={jest.fn}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
