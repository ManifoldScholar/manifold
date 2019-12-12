import SortBy from "../SortBy";

describe("backend/components/project-collection/SortBy", () => {
  def("projectCollection", () => factory("projectCollection"));
  def("sortChangeHandler", () => jest.fn());

  def("root", () => (
    <SortBy
      projectCollection={$projectCollection}
      sortChangeHandler={$sortChangeHandler}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
