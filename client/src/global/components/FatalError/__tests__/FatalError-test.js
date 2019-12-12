import FatalError from "../";

describe("global/components/FatalError", () => {
  def("root", () => (
    <FatalError
      fatalError={{
        error: {
          status: 404,
          heading: "Kriss Kross'll make you",
          body: "Jump, jump"
        },
        type: "TEST"
      }}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
