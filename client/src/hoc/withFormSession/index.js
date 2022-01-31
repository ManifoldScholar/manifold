import React from "react";
import PropTypes from "prop-types";
import hoistStatics from "hoist-non-react-statics";
import { connect } from "react-redux";
import get from "lodash/get";
import has from "lodash/has";
import brackets2dots from "brackets2dots";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function withFormSession(WrappedComponent, sessionKey) {
  const displayName = `HigherOrder.WithFormSession('${getDisplayName(
    WrappedComponent
  )})`;

  class WithFormSession extends React.PureComponent {
    static mapStateToProps = state => {
      return {
        session: get(state.entityEditor.sessions, sessionKey),
        response: get(state.entityStore.responses, sessionKey),
        errors: get(state.entityStore.responses, `${sessionKey}.errors`)
      };
    };

    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    static propTypes = {
      session: PropTypes.object,
      response: PropTypes.object,
      errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
    };

    nameToPath(name) {
      return brackets2dots(name);
    }

    lookupValue = (name, props) => {
      if (!props.session) return null;
      const path = this.nameToPath(name);
      if (has(props.session.dirty, path)) {
        return get(props.session.dirty, path);
      }
      if (has(props.session.source, path)) {
        return get(props.session.source, path);
      }
      return null;
    };

    render() {
      const childProps = {
        form: {
          session: this.props.session,
          response: this.props.response,
          errors: this.props.errors,
          getModelValue: name => this.lookupValue(name, this.props)
        }
      };
      const props = { ...childProps };
      return React.createElement(WrappedComponent, props);
    }
  }

  const ConnectedWithFormSession = connect(WithFormSession.mapStateToProps)(
    WithFormSession
  );

  return hoistStatics(ConnectedWithFormSession, WrappedComponent);
}
