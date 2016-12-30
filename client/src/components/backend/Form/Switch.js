import React, { Component, PropTypes } from 'react';
import sharedPropsValidation from './propTypes';
import { Form } from 'components/backend';
import classNames from 'classnames';

export default class Radios extends Component {

  static displayName = "Form.Switch";

  static propTypes = {
    ...sharedPropsValidation,
    label: PropTypes.string,

  };

  static defaultProps = {
    dirtyModel: {},
    actions: { set: () => {} },
    layout: "horizontal"
  };

  render() {
    return (
      <div className="form-input">
        <div className="boolean-labeled">
          {this.props.label ?
            <span>
              {this.props.label}
            </span> : null
          }
          {/* .toggle-indicator is required for positioning alongside label */}
          <div className="toggle-indicator">
            {/* Add .checked to .boolean-primary to change visual state */}
            <div className="boolean-primary"></div>
          </div>
        </div>
      </div>
    );
  }

}
