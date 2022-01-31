import Categories from "../Categories";
import fixtures from "./__fixtures__";

describe("backend/components/category/List/Categories", () => {
  def("project", fixtures.project);

  def("root", () => (
    <Categories
      project={$project}
      texts={$project.relationships.texts}
      categories={$project.relationships.categories}
      callbacks={{}}
      onTextKeyboardMove={() => {}}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
