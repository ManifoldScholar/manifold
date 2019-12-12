import Placeholder from "../Placeholder";

describe("frontend/components/project-collection/Placeholder", () => {
  def("root", () => <Placeholder />);

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
