import { IngestionNewContainer } from "../New";
import { IngestionEditContainer } from "../Edit";

describe("backend/containers/text/ingestion/New", () => {
  def("text", () => factory("text"));

  def("root", () => (
    <IngestionNewContainer
      text={$text}
      location={{}}
      history={fixtures.history()}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
