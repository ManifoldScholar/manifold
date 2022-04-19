import { NotationPickerContainer } from "../Picker";

describe("reader/containers/notation/Picker", () => {
  def("resources", () => collectionFactory("resource"));
  def("resourceCollections", () => collectionFactory("resourceCollection"));
  def("meta", () => ({ pagination: fixtures.pagination() }));
  def("root", () => (
    <NotationPickerContainer
      resources={$resources}
      resourcesMeta={$meta}
      resourceCollections={[]}
      resourceCollectionsMeta={$meta}
      history={fixtures.history()}
      match={{ params: { textId: "2", sectionId: "3" } }}
      dispatch={$dispatch}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
