import Notifications from "../Notifications";

describe("backend/components/dashboard/Notifications", () => {
  def("root", () => <Notifications />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
