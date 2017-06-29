import React from 'react';
import renderer from 'react-test-renderer';
import { IngestionIngest } from '../Ingest';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';
import { wrapWithRouter } from 'test/helpers/routing';

describe("Backend Ingest Container", () => {

  const ingestion = build.entity.ingestion("1");
  const route = { modal: false };
  const dispatch = jest.fn();
  const history = build.history();
  const props = { ingestion, dispatch, history, route };

  describe("when the ingestion state is sleeping", () => {

    const attr = { state: "sleeping", availableEvents: ["analyze"] };
    props.ingestion =  build.entity.ingestion("1", attr);

    const component = renderer.create(wrapWithRouter(
      <IngestionIngest
        {...props}
      />
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

  describe("when the ingestion state is analyzed", () => {

    const attr = { state: "analyzed", availableEvents: ["reset", "process"] };
    props.ingestion =  build.entity.ingestion("1", attr);

    const component = renderer.create(wrapWithRouter(
      <IngestionIngest
        {...props}
      />
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

  describe("when the ingestion state is finished", () => {

    const attr = { state: "finish", availableEvents: ["reset"] };
    props.ingestion =  build.entity.ingestion("1", attr);

    const component = renderer.create(wrapWithRouter(
      <IngestionIngest
        {...props}
      />
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


});
