import CategoryList from "../index";
import fixtures from "./__fixtures__";

describe("backend/components/category/List", () => {
  def("project", fixtures.project);

  def("root", () => (
    <CategoryList
      project={$project}
      texts={$project.relationships.texts}
      categories={$project.relationships.categories}
      callbacks={{}}
    />
  ));

  it("renders without exception", () => {
    render($withApp($root));
  });

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
