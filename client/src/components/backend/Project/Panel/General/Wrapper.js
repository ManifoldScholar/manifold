import React, { Component, PropTypes } from 'react';
import fakeData from 'helpers/fakeData';
import { Form } from 'components/backend';
import { Link } from 'react-router';

export default class ProjcetPanelGeneral extends Component {

  static displayName = "Project.Panel.General";

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;
    return (
      <section>
        <form className="form-secondary">
          <Form.TextInput
            label="Title"
            placeholder='Enter Project Title'
            value={project.attributes.title}
          />
          <Form.TextInput
            label="Subtitle"
            placeholder='Enter Project Subtitle'
            value={project.attributes.subtitle}
          />
          <Form.Radios label="Radio Buttons"/>
          <Form.Makers label="Creators" makers={project.relationships.creators} />
          <Form.Makers label="Contributors" makers={project.relationships.contributors} />
          <Form.TextArea label="Description" value={project.attributes.description} />
          <Form.Upload label="Upload a File"/>
        </form>
      </section>
    );
  }
}
