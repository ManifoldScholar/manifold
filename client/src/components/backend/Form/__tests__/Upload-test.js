import React, { Component } from "react";
import PropTypes from "prop-types";
import renderer from "react-test-renderer";
import { FormUpload } from "components/backend/Form/Upload";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";
Enzyme.configure({ adapter: new Adapter() });

describe("Backend.Form.Upload component", () => {
  const setMock = jest.fn();
  const setOtherMock = jest.fn();
  const fakeDomEvent = {
    stopPropagation: () => undefined,
    preventDefault: () => undefined
  };

  describe("when the upload input has a value", () => {
    const root = (
      <FormUpload
        set={setMock}
        setOther={setOtherMock}
        remove="attributes[avatarRemove]"
        initialValue="/some/image.jpg"
        layout="portrait"
        label="Cover"
        accepts="images"
      />
    );

    let wrapper;

    beforeEach(() => {
      wrapper = Enzyme.mount(root);
    });

    it("renders correctly", () => {
      const snapshot = renderer.create(root).toJSON();
      expect(snapshot).toMatchSnapshot();
    });

    it("should contain a preview", () => {
      expect(wrapper.find('[data-id="preview"]')).toHaveLength(1);
    });

    it("should contain a remove link", () => {
      expect(wrapper.find('[data-id="remove"]')).toHaveLength(1);
    });

    it("should trigger set callback when remove is clicked", () => {
      setMock.mockClear();
      wrapper.find('[data-id="remove"]').simulate("click", fakeDomEvent);
      expect(setMock).toHaveBeenCalled();
    });

    // While useful, we can't run these tests without warnings in React 16. If we don't
    // mock Dropzone, we end up with warnings in React 16.
    // https://facebook.github.io/jest/docs/en/tutorial-react.html#snapshot-testing-with-mocks-enzyme-and-react-16

    it("should change state.removed to true when remove is clicked", () => {
      setMock.mockClear();
      wrapper.find('[data-id="remove"]').simulate("click", fakeDomEvent);
      expect(wrapper.state().removed).toBe(true);
    });

    // it("should change state.removed to false when a file is dropped", () => {
    //   setMock.mockClear();
    //   wrapper.find('[data-id="remove"]').simulate("click", fakeDomEvent);
    //   expect(wrapper.state().removed).toBe(true);
    //   wrapper.find("Dropzone").simulate("drop", fakeDomEvent);
    //   expect(wrapper.state().removed).toBe(false);
    // });

    it("should trigger setOther callback when remove is clicked", () => {
      setOtherMock.mockClear();
      wrapper.find('[data-id="remove"]').simulate("click", fakeDomEvent);
      expect(setOtherMock).toHaveBeenCalled();
    });

    // it("should trigger set when a file is dropped onto it", () => {
    //   setMock.mockClear();
    //   wrapper.find("Dropzone").simulate("drop", fakeDomEvent);
    //   expect(setMock).toHaveBeenCalled();
    // });
  });

  describe("when the upload input doesn't have a remove prop", () => {
    const root = (
      <FormUpload
        set={setMock}
        setOther={setOtherMock}
        initialValue="/some/image.jpg"
        layout="portrait"
        label="Cover"
        accepts="images"
      />
    );

    let wrapper;

    beforeEach(() => {
      wrapper = Enzyme.mount(root);
    });

    it("renders correctly", () => {
      const snapshot = renderer.create(root).toJSON();
      expect(snapshot).toMatchSnapshot();
    });

    it("should contain a preview", () => {
      expect(wrapper.find('[data-id="preview"]')).toHaveLength(1);
    });

    it("should contain a remove link", () => {
      expect(wrapper.find('[data-id="remove"]')).toHaveLength(1);
    });

    it("should trigger set callback when remove is clicked with null value", () => {
      setMock.mockClear();
      wrapper.find('[data-id="remove"]').simulate("click", fakeDomEvent);
      expect(setMock).toHaveBeenCalled();
    });
  });

  describe("when the upload input doesn't have set and setOther methods", () => {
    const root = (
      <FormUpload
        set={setMock}
        initialValue="/some/image.jpg"
        layout="portrait"
        label="Cover"
        accepts="images"
      />
    );

    let wrapper;
    beforeEach(() => {
      wrapper = Enzyme.mount(root);
    });

    it("renders correctly", () => {
      const snapshot = renderer.create(root).toJSON();
      expect(snapshot).toMatchSnapshot();
    });

    it("should contain a preview", () => {
      expect(wrapper.find('[data-id="preview"]')).toHaveLength(1);
    });

    it("should contain a remove link", () => {
      expect(wrapper.find('[data-id="remove"]')).toHaveLength(1);
    });

    it("should trigger set callback when remove is clicked with null value", () => {
      setMock.mockClear();
      wrapper.find('[data-id="remove"]').simulate("click", fakeDomEvent);
      expect(setMock).toHaveBeenCalled();
    });
  });

  describe("when the upload input has a value but no remove prop", () => {
    const root = (
      <FormUpload
        set={setMock}
        setOther={setOtherMock}
        initialValue="/some/image.jpg"
        layout="portrait"
        label="Cover"
        accepts="images"
      />
    );

    let wrapper;
    beforeEach(() => {
      wrapper = Enzyme.mount(root);
    });

    it("should trigger set callback when remove is clicked with null value", () => {
      setMock.mockClear();
      wrapper.find('[data-id="remove"]').simulate("click", fakeDomEvent);
      expect(setMock).toHaveBeenCalled();
    });

    it("should not trigger setOther callback when remove is clicked", () => {
      setOtherMock.mockClear();
      wrapper.find('[data-id="remove"]').simulate("click", fakeDomEvent);
      expect(setOtherMock).not.toHaveBeenCalled();
    });
  });

  describe("when the upload input does not have a value", () => {
    const root = (
      <FormUpload
        set={setMock}
        setOther={setOtherMock}
        layout="portrait"
        label="Cover"
        accepts="images"
      />
    );

    let wrapper;
    beforeEach(() => {
      wrapper = Enzyme.mount(root);
    });

    it("renders correctly", () => {
      const snapshot = renderer.create(root).toJSON();
      expect(snapshot).toMatchSnapshot();
    });

    it("should not contain a preview", () => {
      expect(wrapper.find('[data-id="preview"]')).toHaveLength(0);
    });

    it("should not contain a remove link", () => {
      expect(wrapper.find('[data-id="remove"]')).toHaveLength(0);
    });
  });
});
