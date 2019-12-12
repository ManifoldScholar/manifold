import Filters from "../Filters";

describe("frontend/components/project-collection/Filters", () => {
  def("root", () => <Filters filterChangeHandler={jest.fn} />);

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
