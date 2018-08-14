import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Authorization from "helpers/authorization";
import { connect } from "react-redux";
import lh from "helpers/linkHandler";

class RedirectToFirstMatch extends React.PureComponent {
  static mapStateToProps = state => {
    return {
      authentication: state.authentication
    };
  };

  static propTypes = {
    from: PropTypes.string.isRequired,
    location: PropTypes.object,
    candidates: PropTypes.array.isRequired,
    authentication: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.authorization = new Authorization();
  }

  componentWillMount() {
    this.maybeRedirect();
  }

  componentDidUpdate() {
    this.maybeRedirect();
  }

  maybeRedirect() {
    if (!this.props.location) return;
    if (
      this.props.from !== this.props.location.pathname &&
      this.props.from !== this.props.location.pathname.replace(/\/$/, "")
    )
      return;

    this.props.candidates.find(candidate => {
      const props = Object.assign({}, candidate, {
        authentication: this.props.authentication
      });
      if (!props.ability || this.authorization.authorize(props)) {
        let path = null;
        if (candidate.path) {
          path = candidate.path;
        } else if (candidate.hasOwnProperty("route")) {
          const args = candidate.args || [];
          path = lh.link(candidate.route, ...args);
        }
        if (path) {
          this.props.history.replace(path);
          return true;
        }
      }
      return false;
    });
  }

  render() {
    return null;
  }
}

export default withRouter(
  connect(RedirectToFirstMatch.mapStateToProps)(RedirectToFirstMatch)
);
