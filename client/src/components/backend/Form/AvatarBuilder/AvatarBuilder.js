import React, { Component, PropTypes } from 'react';
import { Form } from 'components/backend';
import ColorPicker from './ColorPicker';
import { Project as FrontEndProject } from 'components/frontend';
import brackets2dots from 'brackets2dots';
import isObject from 'lodash/isObject';

export default class AvatarBuilder extends Component {

  static displayName = "Form.AvatarBuilder";

  static propTypes = {
      project: PropTypes.object,
      label: PropTypes.string
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
  }

  render() {
    
    const project = this.props.project;

    return (

      <div className="avatar-builder">
        <label className="section-header">Project Thumbnail</label>
        <div className="grid">
          <div className="border current-cover-wrapper">
            <label>Current</label>
              <FrontEndProject.Cover
                project={project} 
              />
          </div> 

          <div className="border active color-picker-wrapper">
            <label>Default</label>
              <ColorPicker
                {...this.props}
                name={this.props.avatarColorName}
              />
          </div>

          <div className="border custom-upload-wrapper">
            <label className="custom">Custom</label>
              <Form.Upload
                {...this.props}
                style="square"
                accepts="images"
                set={this.updateAvatarFile}
                readFrom={this.props.currentAvatarName}
                name={this.props.avatarFileName}
                remove={this.props.removeAvatarName}
              />

          </div>

        </div>

      </div>
    );
  }
}
