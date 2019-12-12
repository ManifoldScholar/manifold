import { IngestionEditContainer } from "../Edit";

describe("backend/containers/text/ingestion/Edit", () => {
  def("text", () => factory("text"));

  def("root", () => (
    <IngestionEditContainer
      text={$text}
      location={{}}
      history={fixtures.history()}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
