import List from "../List";

describe("backend/components/project-collection/List", () => {
  def("projectCollections", () => [
    factory("projectCollection", { id: "1" }),
    factory("projectCollection", { id: "2" }),
    factory("projectCollection", { id: "3" })
  ]);
  def("onCollectionOrderChange", () => jest.fn());
  def("onCollectionSelect", () => jest.fn());
  def("onShowNew", () => jest.fn());
  def("onToggleVisibility", () => jest.fn());
  def("root", () => (
    <List
      projectCollection={$projectCollections[0]}
      projectCollections={$projectCollections}
      onCollectionOrderChange={$onCollectionOrderChange}
      onCollectionSelect={$onCollectionSelect}
      onShowNew={$onShowNew}
      onToggleVisibility={$onToggleVisibility}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
