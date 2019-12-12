import { FormCollaborators } from "../Collaborators";

describe("backend/containers/form-inputs/composite-inputs/Collaborators", () => {
  def("creator", () => factory("maker"));
  def("contributor", () => factory("maker"));
  def("creators", () => [$creator]);
  def("contributors", () => [$contributor]);
  def("text", () =>
    factory("text", {
      relationships: {
        creators: $creators,
        contributors: $contributors
      }
    })
  );
  def("root", () => <FormCollaborators entity={$text} />);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
