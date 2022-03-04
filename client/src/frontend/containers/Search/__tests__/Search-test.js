import Search from "../index";

describe("frontend/containers/Search/Search", () => {
  def("setQuery", () => jest.fn());
  def("setPage", () => jest.fn());

  def("root", () => (
    <Search
      searchQueryState={{}}
      setQuery={$setQuery}
      setPage={$setPage}
      dispatch={$dispatch}
      history={fixtures.history()}
      location={{}}
      match={{}}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
