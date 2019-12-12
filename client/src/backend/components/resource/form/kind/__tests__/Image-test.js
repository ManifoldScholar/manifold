import Image from "../Image";

describe("backend/components/resource/form/kind/Image", () => {
  def("root", () => <Image />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
