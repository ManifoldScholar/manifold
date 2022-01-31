import "@babel/polyfill";
import React from "react";
import fixtures from "test/fixtures";
import testHelpers from "test/helpers";

// Expose our fixture factory globally.
global.fixtures = fixtures;
global.factory = fixtures.factory;
global.collectionFactory = fixtures.collectionFactory;

// Expose helpers globally.
global.testHelpers = testHelpers;

// We mock 3rd party libraries that depend on the refs because react-test-renderer doesn't
// support DOM refs, which breaks our tests.
jest.mock("react-text-mask", () => "react-text-mask");

// We mock 3rd party libraries that depend heavily on hooks because Enzyme does not yet
// support them (and may never. blerg).
jest.mock("react-dropzone", () => {
  return props => {
    return (
      <>
        {props.children({
          getRootProps: () => props,
          getInputProps: () => ({})
        })}
      </>
    );
  };
});

jest.mock("helpers/passwordGenerator", () => {
  return jest.fn(() => "testtest123");
});

jest.mock("date-fns/formatDistance", () => {
  return () => "mocked-date-fns-format-distance-for-snapshot";
});

jest.mock("focus-trap-react", () => "focus-trap-react");

jest.mock("react-uid", () => {
  return {
    UID: jest.fn(props => props.children(1)),
    UIDConsumer: jest.fn(props => props.children(1)),
    useUID: jest.fn(() => "abcdef"),
    useUIDSeed: jest.fn(() => {
      return label => `1-${label}`;
    })
  };
});

jest.mock("use-resize-observer", () => {
  return () => {
    return { width: 1000 };
  };
});

// Mocked fetchData is a noop component that renders its child.
// see src/components/global/HigherOrder/__mocks__/fetchData.js
jest.mock("hoc/fetchData");

// Mocked withFormContext is a noop component that renders its child.
// see src/containers/global/HigherOrder/__mocks__/withFormContext.js
jest.mock("hoc/withFormContext");

// To mock returned data or collection responses, adjust src/api/__mocks__/client.js
jest.mock("api/client");

jest.mock("services/plugin/initializer");

const reactTransitionGroup = jest.requireActual("react-transition-group");
reactTransitionGroup.CSSTransition = ({ children }) => {
  return <>{children}</>;
};
jest.setMock("react-transition-group", reactTransitionGroup);

jest.mock("theme/styles/globalStyles", () => "");
