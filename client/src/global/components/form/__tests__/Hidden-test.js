import Hidden from "../Hidden";

describe("global/components/form/Hidden", () => {
  def("mock", () => jest.fn());
  def("root", () => <Hidden value="attributes[fake]" onChange={$mock} />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
