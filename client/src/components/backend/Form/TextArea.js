import React, { Component, PropTypes } from 'react';
import setter from './setter';
import { Form as GlobalForm } from 'components/global';

class FormTextArea extends Component {

  static displayName = "Form.TextArea";

  static propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    height: PropTypes.number,
    onChange: PropTypes.func,
    value: PropTypes.string,
    errors: PropTypes.array,
    name: PropTypes.string
  }

  static defaultProps = {
    height: 100
  }

  render() {
    return (
      <div className="form-input">
        <GlobalForm.Errorable
          className="form-input"
          name={this.props.name}
          errors={this.props.errors}
          label={this.props.label}
        >
          <label>{this.props.label}</label>
          <textarea
            style={{ height: this.props.height }}
            placeholder={this.props.placeholder}
            onChange={this.props.onChange}
            value={this.props.value}
          />
        </GlobalForm.Errorable>
      </div>
    );
  }

}

export default setter(FormTextArea);
