import React from 'react';
import renderer from 'react-test-renderer';
import Upload from '../Upload';
import build from 'test/fixtures/build';
import { wrapWithRouter, renderWithRouter } from 'test/helpers/routing';

describe("Backend.Ingestion.Form.Upload component", () => {

  const modelValueMock = jest.fn();
  const location = {};
  const history = build.history();

  it('renders correctly', () => {
    const component = renderer.create(
      wrapWithRouter(
        <Upload
          getModelValue={modelValueMock}
          location={location}
          history={history}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
