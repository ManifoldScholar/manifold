import Confirm from "../Confirm";

describe("backend/components/dialog/Confirm", () => {
  let previousAddEventListener;
  let map = {};

  beforeAll(() => {
    // https://github.com/airbnb/enzyme/issues/426
    previousAddEventListener = window.addEventListener;
    window.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
  });

  afterAll(() => {
    window.addEventListener = previousAddEventListener;
  });

  def("resolveMock", () => jest.fn());
  def("rejectMock", () => jest.fn());
  def("root", () => (
    <Confirm
      heading="Player's Ball"
      message="All the players came from far and wide"
      reject={$rejectMock}
      resolve={$resolveMock}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });

  it("should trigger reject callback when cancel is clicked", () => {
    mount($withApp($root))
      .find('[data-id="reject"]')
      .first()
      .simulate("click", { preventDefault() {} });
    expect($rejectMock).toHaveBeenCalled();
  });

  it("should trigger resolve callback when accept is clicked", () => {
    mount($withApp($root))
      .find('[data-id="accept"]')
      .first()
      .simulate("click", { preventDefault() {} });
    expect($resolveMock).toHaveBeenCalled();
  });
});
