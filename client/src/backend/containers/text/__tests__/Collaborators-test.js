import { TextCollaboratorsContainer } from "../Collaborators";

describe("backend/containers/text/Collaborators", () => {
  def("creator", () => factory("maker"));
  def("contributor", () => factory("maker"));
  def("text", () =>
    factory("text", {
      relationships: { creators: [$creator], contributors: [$contributor] }
    })
  );
  def("root", () => (
    <TextCollaboratorsContainer
      text={$text}
      route={fixtures.route()}
      history={fixtures.history()}
      refresh={jest.fn()}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
