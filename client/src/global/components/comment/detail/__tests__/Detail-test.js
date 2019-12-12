import Detail from "../";

describe("global/components/comment/detail/Detail", () => {
  def("handleDeleteMock", () => jest.fn());
  def("handleDestroyMock", () => jest.fn());
  def("handleRestoreMock", () => jest.fn());
  def("handleFlagMock", () => jest.fn());
  def("resource", () => factory("resource"));
  def("comment", () => factory("comment"));
  def("root", () => (
    <Detail
      handleDelete={$handleDeleteMock}
      handleDestroy={$handleDestroyMock}
      handleRestore={$handleRestoreMock}
      handleFlag={$handleFlagMock}
      subject={$resource}
      comment={$comment}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
