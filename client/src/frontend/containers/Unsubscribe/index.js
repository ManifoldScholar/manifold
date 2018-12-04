import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { requests, notificationPreferencesAPI } from "api";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";

const { request } = entityStoreActions;

export class UnsubscribeContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.unsubscribeUser(this.props);
    this.redirectToHome(this.props);
  }

  redirectToHome(props) {
    const url = lh.link("frontend");
    props.history.push(url);
  }

  unsubscribeUser(props) {
    const token = props.match.params.token;
    if (!token) return null;
    const action = notificationPreferencesAPI.unsubscribe(token);
    const unsubscribeRequest = request(action, requests.feUnsubscribe);
    this.props.dispatch(unsubscribeRequest);
  }

  render() {
    return null;
  }
}

export default connect(UnsubscribeContainer.mapStateToProps)(
  UnsubscribeContainer
);
