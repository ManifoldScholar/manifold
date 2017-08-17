import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { textsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import entityUtils from "utils/entityUtils";
import { connect } from "react-redux";
import { About } from "components/reader";

const { select, meta } = entityUtils;
const { request } = entityStoreActions;

class AboutDetailContainer extends PureComponent {
  static displayName = "ReaderContainer.About.Detail";

  static fetchData(getState, dispatch, location, params) {
    const promises = [];
    const textCall = textsAPI.show(params.textId);
    const { promise: one } = dispatch(request(textCall, requests.rText));
    promises.push(one);
    return Promise.all(promises);
  }

  static mapStateToProps(state, ownProps) {
    const newState = {
      text: select(requests.rText, state.entityStore),
      textMeta: meta(requests.rText, state.entityStore)
    };
    return Object.assign({}, newState, ownProps);
  }

  static propTypes = {
    route: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    text: PropTypes.object,
    dispatch: PropTypes.func
  };

  render() {
    if (!this.props.text) return null;

    return (
      <About.Overlay
        history={this.props.history}
        match={this.props.match}
        text={this.props.text}
      />
    );
  }
}

export default connect(AboutDetailContainer.mapStateToProps)(
  AboutDetailContainer
);
