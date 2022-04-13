import { ProjectCategoryEditContainer } from "../Edit";

describe("backend/containers/project/category/Edit", () => {
  def("category", () => factory("category"));
  def("match", () => ({ params: {} }));
  def("refresh", () => jest.fn());
  def("root", () => (
    <ProjectCategoryEditContainer
      category={$category}
      dispatch={$dispatch}
      match={$match}
      refresh={$refresh}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
