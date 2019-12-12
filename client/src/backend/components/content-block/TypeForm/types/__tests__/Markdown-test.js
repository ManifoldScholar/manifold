import Markdown from "../Markdown";

describe("backend/components/content-block/TypeForm/types/Markdown", () => {
  def("root", () => <Markdown setOther={jest.fn} />);

  it("matches the snapshot", () => {
    expect(render($root)).toMatchSnapshot();
  });
});
