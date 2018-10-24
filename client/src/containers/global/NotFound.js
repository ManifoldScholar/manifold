import React, { Component } from "react";
import { connect } from "react-redux";
import { fatalErrorActions } from "actions";
import PropTypes from "prop-types";

class NotFound extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.dispatch(fatalErrorActions.trigger404());
  }

  render() {
    return null;
  }
}

export default connect()(NotFound);
