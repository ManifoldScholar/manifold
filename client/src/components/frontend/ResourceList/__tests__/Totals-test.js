import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { renderWithRouter, wrapWithRouter } from 'test/helpers/routing';
import renderer from 'react-test-renderer';
import { ResourceList } from 'components/frontend';

describe("ResourceTotals Component", () => {

  it("renders correctly", () => {
    const component = renderer.create(wrapWithRouter(
      <ResourceList.Totals
        count={3}
        projectId="1"
      />
    ));
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("displays the correct count", () => {
    const wrapper = renderWithRouter(
      <ResourceList.Totals
        count={3}
        projectId="1"
      />
    );
    expect(wrapper.find('[data-id="count"]').text()).toBe("3");
  });

  it("doesn't render the count when there is no count", () => {
    const wrapper = renderWithRouter(
      <ResourceList.Totals
        count={null}
        projectId="1"
      />
    );
    expect(wrapper.find('[data-id="total-container"]')).toHaveLength(1);
    expect(wrapper.find('[data-id="count"]')).toHaveLength(0);
  });

});

