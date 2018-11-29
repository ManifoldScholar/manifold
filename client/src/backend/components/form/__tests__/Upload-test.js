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
