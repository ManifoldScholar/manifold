import React from "react";
import PropTypes from "prop-types";
import hoistStatics from "hoist-non-react-statics";
import get from "lodash/get";
import has from "lodash/has";
import brackets2dots from "brackets2dots";
import withFormContext from "hoc/withFormContext";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function setter(WrappedComponent) {
  const displayName = `Form.Setter('${getDisplayName(WrappedComponent)})`;

  class Setter extends React.PureComponent {
    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    static propTypes = {
      sessionKey: PropTypes.string,
      afterChange: PropTypes.func,
      dirtyModel: PropTypes.object,
      sourceModel: PropTypes.object,
      readFrom: PropTypes.string,
      name: PropTypes.string,
      actions: PropTypes.shape({
        set: PropTypes.func
      }).isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.bool,
        PropTypes.number,
        PropTypes.array
      ])
    };

    static defaultProps = {
      actions: {
        set: () => {}
      }
    };

    componentDidMount() {
      if (this.isConnected(this.props) && has(this.props, "value")) {
        this.setValue(this.props.value, this.props);
      }
    }

    componentDidUpdate(prevProps) {
      if (
        has(this.props, "value") &&
        get(this.props, "value") !== get(prevProps, "value")
      ) {
        this.setValue(this.props.value, this.props);
      }
      if (this.props.afterChange) {
        if (this.dirtyValue(this.props) !== this.dirtyValue(prevProps)) {
          this.props.afterChange(
            this.dirtyValue(this.props),
            this.buildSetHandler(this.props),
            this.buildSetOtherHandler(this.props)
          );
        }
      }
    }

    setOtherValue(value, name, triggersDirty, props) {
      const path = `${this.nameToPath(name)}.$set`;
      props.actions.set(props.sessionKey, path, value, triggersDirty);
    }

    setValue(value, props, triggersDirty = true) {
      if (!this.isConnected(props)) return;
      const path = this.setPath(props);
      props.actions.set(props.sessionKey, path, value, triggersDirty);
    }

    setPath(props) {
      return `${this.nameToPath(props.name)}.$set`;
    }

    sourceValue(props) {
      if (has(props, "readFrom")) {
        return get(props.sourceModel, this.nameToPath(props.readFrom));
      }
      return get(props.sourceModel, this.nameToPath(props.name));
    }

    dirtyValue(props) {
      return get(props.dirtyModel, this.nameToPath(props.name));
    }

    isDirtyValueSet(props) {
      return has(props.dirtyModel, this.nameToPath(props.name));
    }

    nameToPath(name) {
      return brackets2dots(name);
    }

    currentValue(props) {
      return this.isDirtyValueSet(props)
        ? this.dirtyValue(props)
        : this.sourceValue(props);
    }

    passthroughProps(props) {
      /* eslint-disable no-unused-vars */
      const { dirtyModel, sourceModel, readFrom, actions, ...other } = props;
      /* eslint-enable no-unused-vars */
      return other;
    }

    connectedProps(props) {
      const additional = {
        onChange: this.buildOnChangeHandler(props),
        set: this.buildSetHandler(props),
        setOther: this.buildSetOtherHandler(props),
        value: this.currentValue(props),
        initialValue: this.sourceValue(props)
      };
      return { ...this.passthroughProps(props), ...additional };
    }

    disconnectedProps(props) {
      const additional = {
        setOther: this.buildSetOtherHandler(props)
      };
      return { ...additional, ...this.passthroughProps(props) };
    }

    buildOnChangeHandler(props) {
      return event => {
        const target = event.target;
        const value = target.value;
        this.setValue(value, props);
      };
    }

    buildSetHandler(props) {
      return (value, triggersDirty = true) => {
        return this.setValue(value, props, triggersDirty);
      };
    }

    buildSetOtherHandler(props) {
      return (value, name, triggersDirty = true) => {
        return this.setOtherValue(value, name, triggersDirty, props);
      };
    }

    isConnected(props) {
      if (props.name) return true;
      return false;
    }

    render() {
      const props = this.isConnected(this.props)
        ? this.connectedProps(this.props)
        : this.disconnectedProps(this.props);
      return React.createElement(WrappedComponent, props);
    }
  }

  const WrappedWithFormContext = withFormContext(Setter);

  return hoistStatics(WrappedWithFormContext, WrappedComponent, {
    getDerivedStateFromProps: true
  });
}
