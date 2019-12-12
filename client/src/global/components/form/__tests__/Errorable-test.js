import Errorable from "../Errorable";

describe("global/components/form/Errorable", () => {
  def("error", () => ({
    detail: "can't be blank",
    source: {
      pointer: "/data/attributes/name"
    }
  }));
  def("root", () => (
    <Errorable name="attributes[name]" children={[]} errors={[$error]} />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
