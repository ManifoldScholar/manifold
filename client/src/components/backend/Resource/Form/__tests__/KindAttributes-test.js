import React from 'react';
import renderer from 'react-test-renderer';
import KindAttributes from '../KindAttributes';

describe("Backend.Resource.Form.KindAttributes component", () => {

  function getModelValue(kind) {
    return kind;
  }

  describe("when kind is audio", () => {

    it('renders correctly', () => {
      const component = renderer.create(
        <KindAttributes
          getModelValue={() => getModelValue("image")}
        />
      );
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  // describe("when kind is document", () => {
  //
  //   it('renders correctly', () => {
  //     const component = renderer.create(
  //       <KindAttributes
  //         getModelValue={() => getModelValue("document")}
  //       />
  //     );
  //     let tree = component.toJSON();
  //     expect(tree).toMatchSnapshot();
  //   });
  // });
  //
  // describe("when kind is file", () => {
  //
  //   it('renders correctly', () => {
  //     const component = renderer.create(
  //       <KindAttributes
  //         getModelValue={() => getModelValue("file")}
  //       />
  //     );
  //     let tree = component.toJSON();
  //     expect(tree).toMatchSnapshot();
  //   });
  // });
  //
  // describe("when kind is interactive", () => {
  //
  //   it('renders correctly', () => {
  //     const component = renderer.create(
  //       <KindAttributes
  //         getModelValue={() => getModelValue("interactive")}
  //       />
  //     );
  //     let tree = component.toJSON();
  //     expect(tree).toMatchSnapshot();
  //   });
  // });
  //
  // describe("when kind is link", () => {
  //
  //   it('renders correctly', () => {
  //     const component = renderer.create(
  //       <KindAttributes
  //         getModelValue={() => getModelValue("link")}
  //       />
  //     );
  //     let tree = component.toJSON();
  //     expect(tree).toMatchSnapshot();
  //   });
  // });
  //
  // describe("when kind is pdf", () => {
  //
  //   it('renders correctly', () => {
  //     const component = renderer.create(
  //       <KindAttributes
  //         getModelValue={() => getModelValue("pdf")}
  //       />
  //     );
  //     let tree = component.toJSON();
  //     expect(tree).toMatchSnapshot();
  //   });
  // });
  //
  // describe("when kind is presentation", () => {
  //
  //   it('renders correctly', () => {
  //     const component = renderer.create(
  //       <KindAttributes
  //         getModelValue={() => getModelValue("presentation")}
  //       />
  //     );
  //     let tree = component.toJSON();
  //     expect(tree).toMatchSnapshot();
  //   });
  // });
  //
  // describe("when kind is spreadsheet", () => {
  //
  //   it('renders correctly', () => {
  //     const component = renderer.create(
  //       <KindAttributes
  //         getModelValue={() => getModelValue("spreadsheet")}
  //       />
  //     );
  //     let tree = component.toJSON();
  //     expect(tree).toMatchSnapshot();
  //   });
  // });
  //
  // describe("when kind is video", () => {
  //
  //   it('renders correctly', () => {
  //     const component = renderer.create(
  //       <KindAttributes
  //         getModelValue={() => getModelValue("video")}
  //         sourceModel={{
  //           attributes: {}
  //         }}
  //       />
  //     );
  //     let tree = component.toJSON();
  //     expect(tree).toMatchSnapshot();
  //   });
  // });
});

