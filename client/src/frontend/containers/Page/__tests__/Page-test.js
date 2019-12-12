import { PageContainer } from "../";

describe("frontend/containers/Page/Page", () => {
  def("page", () => factory("page"));
  def("root", () => <PageContainer page={$page} />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
