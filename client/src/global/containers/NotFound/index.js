import { Component } from "react";
import { connect } from "react-redux";
import { fatalErrorActions } from "actions";
import PropTypes from "prop-types";

class NotFound extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  trigger404() {
    this.props.dispatch(fatalErrorActions.trigger404());
  }

  componentDidMount() {
    this.trigger404();
  }

  UNSAFE_componentWillMount() {
    if (__SERVER__) this.trigger404();
  }

  render() {
    return null;
  }
}

export default connect()(NotFound);
