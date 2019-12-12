import HasMany from "../HasMany";

describe("global/components/form/HasMany", () => {
  def("makers", () => collectionFactory("maker"));
  def("mock", () => jest.fn());

  def("root", () => (
    <HasMany
      label="makers"
      entities={$makers}
      onChange={$mock}
      optionsFetch={$mock}
      onNew={$mock}
      fetch={$mock}
      entityLabelAttribute="name"
      orderable
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
