import SmartAttributes from "../SmartAttributes";

describe("backend/components/project-collection/form/SmartAttributes", () => {
  def("projectCollection", () => factory("projectCollection"));
  def("getModelValue", () =>
    jest.fn(() => $projectCollection.attributes.smart)
  );

  def("root", () =>
    $withFormContext(
      <SmartAttributes projectCollection={$projectCollection} />,
      { sourceModel: $projectCollection, getModelValue: $getModelValue }
    )
  );

  describe("when the project collection is smart", () => {
    def("projectCollection", () =>
      factory("projectCollection", { attributes: { smart: true } })
    );
    it("matches the snapshot when rendered", () => {
      expect(render($withApp($root))).toMatchSnapshot();
    });
  });

  describe("when the project collection is not smart", () => {
    def("projectCollection", () =>
      factory("projectCollection", { attributes: { smart: false } })
    );
    it("renders does not render", () => {
      expect(render($withApp($root)).html()).toBe("");
    });
  });
});
