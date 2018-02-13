// We mock 3rd party libraries that depend on the refs because react-test-renderer doesn't
// support DOM refs, which breaks our tests.
jest.mock('react-dropzone', () => 'react-dropzone');
jest.mock("react-text-mask", () => "react-text-mask");
jest.mock("helpers/passwordGenerator", () => {
  return jest.fn(() => "testtest123");
});

// Mocked fetch-data is a noop component that renders it's child.
// see src/components/global/HigherOrder/__mocks__/fetchData.js
jest.mock("components/global/HigherOrder/fetchData");

// To mock returned data or collection responses, adjust src/api/__mocks__/client.js
jest.mock("api/client");
