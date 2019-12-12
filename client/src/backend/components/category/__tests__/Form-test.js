import Form from "../Form";

describe("backend/components/category/Form", () => {
  def("root", () => <Form projectId="1" />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
