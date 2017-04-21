import React, { Component, PropTypes } from 'react';
import renderer from 'react-test-renderer';
import { Form } from 'components/backend';
import { shallow, mount, render } from 'enzyme';

describe("Form.Upload component", () => {

  const setMock = jest.fn();
  const setOtherMock = jest.fn();
  const fakeDomEvent = { stopPropagation: () => undefined, preventDefault: () => undefined };

  describe("when the upload input has a value", () => {

    const root = (
      <Form.Upload
        set={setMock}
        setOther={setOtherMock}
        remove="attributes[avatarRemove]"
        initialValue="/some/image.jpg"
        style="portrait"
        label="Cover"
        accepts="images"
      />
    );

    let wrapper;
    beforeEach(() => {
      wrapper  = shallow(root).first().shallow();
    });

    it('renders correctly', () => {
      const tree =  renderer.create(root).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should contain a preview', () => {
      expect(wrapper.find('[data-id="preview"]')).toHaveLength(1);
    });

    it('should contain a remove link', () => {
      expect(wrapper.find('[data-id="remove"]')).toHaveLength(1);
    });

    it('should trigger set callback when remove is clicked', () => {
      setMock.mockClear();
      wrapper.find('[data-id="remove"]').simulate('click', fakeDomEvent);
      expect(setMock).toHaveBeenCalled();
    });

    it('should change state.removed to true when remove is clicked', () => {
      setMock.mockClear();
      wrapper.find('[data-id="remove"]').simulate('click', fakeDomEvent);
      expect(wrapper.state().removed).toBe(true);
    });

    it('should change state.removed to false when a file is dropped', () => {
      setMock.mockClear();
      wrapper.find('[data-id="remove"]').simulate('click', fakeDomEvent);
      expect(wrapper.state().removed).toBe(true);
      wrapper.find('Dropzone').simulate('drop', fakeDomEvent);
      expect(wrapper.state().removed).toBe(false);
    });

    it('should trigger setOther callback when remove is clicked', () => {
      setOtherMock.mockClear();
      wrapper.find('[data-id="remove"]').simulate('click', fakeDomEvent);
      expect(setOtherMock).toHaveBeenCalled();
    });

    it('should trigger set when a file is dropped onto it', () => {
      setMock.mockClear();
      wrapper.find('Dropzone').simulate('drop', fakeDomEvent);
      expect(setMock).toHaveBeenCalled();
    });

  });

  describe("when the upload input doesn't have a remove prop", () => {

    const root = (
      <Form.Upload
        set={setMock}
        setOther={setOtherMock}
        initialValue="/some/image.jpg"
        style="portrait"
        label="Cover"
        accepts="images"
      />
    );

    let wrapper;
    beforeEach(() => {
      wrapper  = shallow(root).first().shallow();
    });

    it('renders correctly', () => {
      const tree =  renderer.create(root).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should contain a preview', () => {
      expect(wrapper.find('[data-id="preview"]')).toHaveLength(1);
    });

    it('should contain a remove link', () => {
      expect(wrapper.find('[data-id="remove"]')).toHaveLength(1);
    });

    it('should trigger set callback when remove is clicked with null value', () => {
      setMock.mockClear();
      wrapper.find('[data-id="remove"]').simulate('click', fakeDomEvent);
      expect(setMock).toHaveBeenCalled();
    });

  });

  describe("when the upload input doesn't have set and setOther methods", () => {

    const root = (
      <Form.Upload
        set={setMock}
        initialValue="/some/image.jpg"
        style="portrait"
        label="Cover"
        accepts="images"
      />
    );

    let wrapper;
    beforeEach(() => {
      wrapper  = shallow(root).first().shallow();
    });

    it('renders correctly', () => {
      const tree =  renderer.create(root).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should contain a preview', () => {
      expect(wrapper.find('[data-id="preview"]')).toHaveLength(1);
    });

    it('should contain a remove link', () => {
      expect(wrapper.find('[data-id="remove"]')).toHaveLength(1);
    });

    it('should trigger set callback when remove is clicked with null value', () => {
      setMock.mockClear();
      wrapper.find('[data-id="remove"]').simulate('click', fakeDomEvent);
      expect(setMock).toHaveBeenCalled();
    });

  });

  describe("when the upload input has a value but no remove prop", () => {

    const root = (
      <Form.Upload
        set={setMock}
        setOther={setOtherMock}
        initialValue="/some/image.jpg"
        style="portrait"
        label="Cover"
        accepts="images"
      />
    );

    let wrapper;
    beforeEach(() => {
      wrapper  = shallow(root).first().shallow();
    });

    it('should trigger set callback when remove is clicked with null value', () => {
      setMock.mockClear();
      wrapper.find('[data-id="remove"]').simulate('click', fakeDomEvent);
      expect(setMock).toHaveBeenCalled();
    });

    it('should not trigger setOther callback when remove is clicked', () => {
      setOtherMock.mockClear();
      wrapper.find('[data-id="remove"]').simulate('click', fakeDomEvent);
      expect(setOtherMock).not.toHaveBeenCalled();
    });

  });

  describe("when the upload input does not have a value", () => {

    const root = (
      <Form.Upload
        set={setMock}
        setOther={setOtherMock}
        style="portrait"
        label="Cover"
        accepts="images"
      />
    );

    let wrapper;
    beforeEach(() => {
      wrapper  = shallow(root).first().shallow();
    });

    it('renders correctly', () => {
      const tree =  renderer.create(root).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should not contain a preview', () => {
      expect(wrapper.find('[data-id="preview"]')).toHaveLength(0);
    });

    it('should not contain a remove link', () => {
      expect(wrapper.find('[data-id="remove"]')).toHaveLength(0);
    });

  });

});
