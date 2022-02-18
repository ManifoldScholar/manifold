import SortBy from "../SortBy";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: "manifold.lvh"
  })
}));

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
