import { TwitterQueryEditContainer } from "../Edit";

describe("backend/containers/twitter-query/Edit", () => {
  def("twitterQuery", () => factory("twitterQuery"));
  def("root", () => (
    <TwitterQueryEditContainer
      twitterQuery={$twitterQuery}
      dispatch={$dispatch}
      match={{ params: {} }}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
