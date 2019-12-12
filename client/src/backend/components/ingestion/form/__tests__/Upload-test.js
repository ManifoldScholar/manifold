import Upload from "../Upload";

describe("backend/components/ingestion/form/Upload", () => {
  def("getModelValue", () => jest.fn());
  def("root", () => (
    <Upload
      getModelValue={$getModelValue}
      location={$location}
      history={$history}
    />
  ));

  it("matches the snapshot", () => {
    expect(render($withApp($root))).toMatchSnapshot();
  });
});
