import Wrapper from "../Wrapper";

describe("backend/components/ingestion/form/Wrapper", () => {
  def("getModelValue", () => jest.fn());
  def("project", () => factory("project"));
  def("root", () => (
    <Wrapper
      name="attributes[something]"
      getModelValue={$getModelValue}
      location={$location}
      history={$history}
      project={$project}
    />
  ));

  it("matches the snapshot after mounting", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
