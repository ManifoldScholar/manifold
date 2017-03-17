import React, { Component, PropTypes } from 'react';
import { Form } from 'components/backend';
import classnames from 'classnames';

export default class FormHiddenInput extends Component {

  static displayName = "Form.Hidden.Input";

  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setValue();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) this.setValue();
  }

  setValue() {
    this.props.setValue(this.props.value);
  }

  render() {
    return (
      <input type="hidden" value={this.props.value} />
    );
  }

}
