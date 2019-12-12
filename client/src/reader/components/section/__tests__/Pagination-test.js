import Pagination from "../Pagination";

describe("reader/components/section/Pagination", () => {
  def("text", () => factory("text"));
  def("root", () => (
    <Pagination text={$text} sectionId={"2"} spine={["1234", "5678", "0000"]} />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
