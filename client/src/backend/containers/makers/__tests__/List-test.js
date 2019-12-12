import { MakersListContainer } from "../List";

describe("backend/containers/makers/List", () => {
  def("maker", () => factory("maker"));
  def("makers", () => [$maker]);
  def("pagination", () => fixtures.pagination());
  def("root", () => (
    <MakersListContainer
      makers={$makers}
      makersMeta={{ pagination: $pagination }}
      match={{
        params: {}
      }}
      route={{}}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });

  it("does not render a null value", () => {
    expect(render($withApp($root)).html()).not.toBeNull();
  });
});
