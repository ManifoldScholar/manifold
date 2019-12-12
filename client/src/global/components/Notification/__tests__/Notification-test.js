import Notification from "../";

describe("global/components/Notification", () => {
  def("mock", () => jest.fn());
  def("root", () => (
    <Notification
      id="1"
      heading="Welcome to the Terrordome"
      body="Here's your ticket.  Every time I get wicked."
      level={2}
      removeNotification={$mock}
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });

  it("should trigger removeNotification callback when close is clicked", () => {
    const wrapper = mount($root);
    $mock.mockClear();
    wrapper
      .find('[data-id="close"]')
      .first()
      .simulate("click");
    expect($mock).toHaveBeenCalled();
  });
});
