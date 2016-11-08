import React, { Component, PropTypes } from 'react';
import fakeData from 'helpers/fakeData';
import { Form } from 'components/backend';
import { Link } from 'react-router';

export default class ProjcetPanelGeneral extends Component {

  static displayName = "Project.Panel.General";

  static propTypes = {};

  render() {
    return (
      <section>
        <form className="form-secondary">
          <Form.TextInput label="Title"/>
          <Form.TextInput label="Subtitle"/>
          <Form.Radios label="Radio Buttons"/>
          <Form.Makers label="Authors" makers={fakeData.backendAuthors} />
          <Form.Makers label="Authors" makers={fakeData.backendEditors} />
          <Form.TextArea label="Synopses"/>
        </form>
      </section>
    );
  }
}
