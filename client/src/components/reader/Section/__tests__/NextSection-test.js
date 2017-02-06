import React from 'react';
import renderer from 'react-test-renderer';
import { Section } from 'components/reader'

describe("NextSection component", () => {

  const sectionId = "1234-5678-9000";
  const sectionsMap = [
      {id: "1234-5678-9000", name: "First Section"},
      {id: "2345-5678-1111", name: "Second Section"}
    ];

  it('renders correctly', () => {
    const component = renderer.create(
      <Section.NextSection
        sectionId={sectionId}
        sectionsMap={sectionsMap}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
