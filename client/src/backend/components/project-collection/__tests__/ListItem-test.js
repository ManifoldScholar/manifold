import ListItem from "../ListItem";

describe("backend/components/project-collection/ListItem", () => {
  def("projectCollection", () => factory("projectCollection"));
  def("clickHandler", () => jest.fn());
  def("visibilityToggleHandler", () => jest.fn());

  def("root", () => (
    <ListItem
      clickHandler={$clickHandler}
      visibilityToggleHandler={$visibilityToggleHandler}
      entity={$projectCollection}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
