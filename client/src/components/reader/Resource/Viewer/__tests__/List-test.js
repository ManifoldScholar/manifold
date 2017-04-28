import React from 'react';
import List from '../List';
import { mount } from 'enzyme';
import build from 'test/fixtures/build';
import { Provider } from 'react-redux';
import { wrapWithRouter, renderWithRouter } from 'test/helpers/routing';

describe("Reader.Resource.Viewer.List component", () => {

  const resources = [build.entity.resource("1"), build.entity.resource("2")];
  const resourceMarkers = [
    {
      annotationId: "1",
      rect: {
        top: 600
      },
      resourceId: "1"
    },
    {
      annotationId: "2",
      rect: {
        top: 600
      },
      resourceId: "2"
    }
  ];
  const store = build.store();

  const root = (
    wrapWithRouter(
      <Provider store={store} >
        <List
          resources={resources}
          resourceMarkers={resourceMarkers}
        />
      </Provider>
    )
  );

  it('renders correctly', () => {
    const component = mount(root);
    let tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

});
