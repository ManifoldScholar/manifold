import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { IngestionNew } from '../New';
import build from 'test/fixtures/build';
import { wrapWithRouter } from 'test/helpers/routing';

describe("Backend TextDetail Ingestion New Container", () => {

  const project = build.entity.project("1");
  const text = build.entity.text("2", {}, { project });
  const location =  {};
  const history = build.history();

  const props = { text, location, history };

  const component = renderer.create(wrapWithRouter(
    <Provider store={build.store()}>
      <IngestionNew
        {...props}
      />
    </Provider>
  ));

  it("renders correctly", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.toJSON();
    expect(tree).not.toBe(null);
  });

});
