import SimpleFormat from "../SimpleFormat";

describe("global/components/helper/SimpleFormat", () => {
  def("root", () => (
    <SimpleFormat
      text="Basketball is my favorite sport.
        I like the way they dribble up and down the court."
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
