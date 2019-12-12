import Button from "../Button";

describe("reader/components/return-menu/Button", () => {
  def("toggleMock", () => jest.fn());
  def("root", () => <Button toggleReaderMenu={$toggleMock} expanded={false} />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
