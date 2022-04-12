import { IngestionIngest } from "../Ingest";

describe("backend/containers/ingestion/Ingest", () => {
  def("$ingestionAttributes", () => ({
    state: "sleeping",
    availableEvents: ["analyze"]
  }));
  def("ingestion", () =>
    factory("ingestion", { attributes: $ingestionAttributes })
  );
  def("history", () => fixtures.history());
  def("root", () => (
    <IngestionIngest
      ingestion={$ingestion}
      dispatch={$dispatch}
      history={$history}
      route={{ modal: false }}
      t={key => key}
    />
  ));

  describe("when the ingestion state is sleeping", () => {
    it("matches the snapshot when rendered", () => {
      expect(render($withApp($root)).html()).toMatchSnapshot();
    });
  });

  describe("when the ingestion state is sleeping", () => {
    def("ingestionAttributes", () => ({
      state: "finish",
      availableEvents: ["reset"]
    }));

    it("matches the snapshot when rendered", () => {
      expect(render($withApp($root)).html()).toMatchSnapshot();
    });
  });
});
