import Form from "../Form";

describe("backend/components/twitter-query/Form", () => {
  def("twitterQuery", () => factory("twitterQuery"));
  def("root", () => (
    <Form projectId="1" twitterQuery={$twitterQuery} name="twitter-query" />
  ));
  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root))).toMatchSnapshot();
  });
});
