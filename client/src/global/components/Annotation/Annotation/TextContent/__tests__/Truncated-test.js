import Truncated from "../Truncated";

describe("global/components/Annotation/Annotation/TextContent/Truncated", () => {
  def("root", () => (
    <Truncated
      truncate={40}
      selection="You will remember we from now til forever, G. I am infinity, lyrics flowing endlessly."
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
