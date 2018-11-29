import renderer from "react-test-renderer";
import { Event } from "components/frontend";
import React from "react";

describe("Event.Thumbnail component", () => {
  const buildTree = type => {
    const model = {
      attributes: {
        eventType: type,
        eventTitle: "Don't Stop Me Now",
        excerpt: "That's why they call me Mr. Fahrenheit"
      }
    };
    return renderer.create(<Event.Thumbnail event={model} />).toJSON();
  };

  const types = [
    "annotation_added",
    "project_created",
    "resource_added",
    "text_added",
    "tweet"
  ];
  types.forEach(type => {
    it(`renders thumbnail for ${type} correctly`, () => {
      const tree = buildTree(type);
      expect(tree).toMatchSnapshot();
    });
  });
});
