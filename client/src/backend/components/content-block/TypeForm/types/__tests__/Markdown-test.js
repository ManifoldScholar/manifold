import Markdown from "../Markdown";

describe("backend/components/content-block/TypeForm/types/Markdown", () => {
  def("root", () => <Markdown setOther={jest.fn} />);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
