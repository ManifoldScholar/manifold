import React, { Component, PropTypes } from 'react';
import { Form } from 'components/backend';
import ColorPicker from './ColorPicker';
import brackets2dots from 'brackets2dots';
import isObject from 'lodash/isObject';

export default class AvatarBuilder extends Component {

  static displayName = "Form.AvatarBuilder";

  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>

        <ColorPicker
          {...this.props}
          name={this.props.avatarColorName}
        />

        <Form.Upload
          {...this.props}
          style="square"
          label="Avatar"
          accepts="images"
          set={this.updateAvatarFile}
          readFrom={this.props.currentAvatarName}
          name={this.props.avatarFileName}
          remove={this.props.removeAvatarName}
        />

      </div>
    );
  }
}
