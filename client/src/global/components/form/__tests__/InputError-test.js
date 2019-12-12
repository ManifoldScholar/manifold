import InputError from "../InputError";

describe("global/components/form/InputError", () => {
  def("error", () => ({
    detail: "can't be blank",
    source: {
      pointer: "/data/attributes/name"
    }
  }));
  def("root", () => <InputError errors={[$error]} />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
