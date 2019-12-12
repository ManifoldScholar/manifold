import { NotationResourceDetailContainer } from "../Detail";

describe("reader/containers/notation/resource/Detail", () => {
  def("resource", () => factory("resource"));
  def("meta", () => ({ pagination: fixtures.pagination() }));
  def("handleClose", () => jest.fn());

  def("root", () => (
    <NotationResourceDetailContainer
      resource={$resource}
      resourceMeta={$meta}
      history={fixtures.history()}
      match={{ params: { textId: "2", sectionId: "3" } }}
      handleClose={$handleClose}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
