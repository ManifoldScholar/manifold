import Category from "../Category";
import fixtures from "./__fixtures__";

describe("backend/components/category/List/Category", () => {
  def("project", fixtures.project);

  def("root", () => (
    <Category
      project={$project}
      texts={$project.relationships.texts}
      category={$project.relationships.categories[0]}
      callbacks={{}}
      index={1}
      onTextKeyboardMove={() => {}}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
