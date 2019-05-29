import "@babel/polyfill";

// We mock 3rd party libraries that depend on the refs because react-test-renderer doesn't
// support DOM refs, which breaks our tests.
jest.mock("react-dropzone", () => "react-dropzone");
jest.mock("react-text-mask", () => "react-text-mask");
jest.mock("helpers/passwordGenerator", () => {
  return jest.fn(() => "testtest123");
});

jest.mock("date-fns/distance_in_words", () => {
  return () => "mocked-distance-in-words-for-snapshot"
});

jest.mock("focus-trap-react", () => "focus-trap-react");
jest.mock("react-uid", () => {
  return {
    UID: jest.fn(props => props.children(1))
  };
});

// Mocked fetchData is a noop component that renders its child.
// see src/components/global/HigherOrder/__mocks__/fetchData.js
jest.mock("hoc/fetch-data");

// Mocked withFormContext is a noop component that renders its child.
// see src/containers/global/HigherOrder/__mocks__/withFormContext.js
jest.mock("hoc/with-form-context");

// To mock returned data or collection responses, adjust src/api/__mocks__/client.js
jest.mock("api/client");

jest.mock("services/plugin/initializer");
