export default function makeHistoryFixture() {
  return {
    push: jest.fn(),
    replace: jest.fn()
  };
}
