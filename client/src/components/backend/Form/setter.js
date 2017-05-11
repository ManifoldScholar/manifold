import React, { PropTypes } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import get from 'lodash/get';
import has from 'lodash/has';
import brackets2dots from 'brackets2dots';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function setter(WrappedComponent) {

  const displayName = `Form.Setter('${getDisplayName(WrappedComponent)})`;

  class Setter extends React.PureComponent {

    static displayName = displayName;
    static WrappedComponent = WrappedComponent;

    static propTypes = {
      sessionKey: PropTypes.string,
      dirtyModel: PropTypes.object,
      sourceModel: PropTypes.object,
      readFrom: PropTypes.string,
      name: PropTypes.string,
      actions: PropTypes.shape({
        set: PropTypes.func
      }).isRequired
    };

    static defaultProps = {
      actions: {
        set: () => { console.log(WrappedComponent, "No actions passed to setter."); }
      }
    };

    constructor(props) {
      super(props);
      this.callbackSet = this.callbackSet.bind(this);
      this.callbackChange = this.callbackChange.bind(this);
    }

    componentWillMount() {
      if (this.isConnected(this.props) && has(this.props, 'value')) {
        this.setValue(this.props.value, this.props);
      }
    }

    componentWillReceiveProps(nextProps) {
      if (
        has(nextProps, 'value') &&
        (get(nextProps, 'value') !== get(this.props, 'value'))
      ) {
        this.setValue(nextProps.value, nextProps);
      }
    }

    callbackSet(value, props) {
      this.setValue(value, props);
    }

    callbackSetOther(value, name, triggersDirty, props) {
      this.setOtherValue(value, name, triggersDirty, props);
    }

    callbackChange(event, props) {
      const target = event.target;
      const value = target.value;
      this.setValue(value, props);
    }

    setOtherValue(value, name, triggersDirty, props) {
      if (!this.isConnected(props)) return;
      const path = `${this.nameToPath(name)}.$set`;
      props.actions.set(props.sessionKey, path, value, triggersDirty);
    }

    setValue(value, props, triggersDirty = true) {
      if (!this.isConnected(props)) return;
      const path = this.setPath(props);
      props.actions.set(props.sessionKey, path, value, triggersDirty);
    }

    isDirtyValueSet(props) {
      return has(props.dirtyModel, this.nameToPath(props.name));
    }

    dirtyValue(props) {
      return get(props.dirtyModel, this.nameToPath(props.name));
    }

    sourceValue(props) {
      if (has(props, 'readFrom')) {
        return get(props.sourceModel, this.nameToPath(props.readFrom));
      }
      return get(props.sourceModel, this.nameToPath(props.name));
    }

    setPath(props) {
      return `${this.nameToPath(props.name)}.$set`;
    }

    nameToPath(name) {
      return brackets2dots(name);
    }

    currentValue(props) {
      return this.isDirtyValueSet(props) ? this.dirtyValue(props) : this.sourceValue(props);
    }

    passthroughProps(props) {
      const { dirtyModel, sourceModel, readFrom, actions, ...other } = props;
      return other;
    }

    additionalProps(props) {
      const setOther = (value, name, triggersDirty = true) => {
        this.callbackSetOther(value, name, triggersDirty, props);
      };
      return {
        onChange: (event) => this.callbackChange(event, props),
        set: (value) => this.callbackSet(value, props),
        setOther,
        value: this.currentValue(props),
        initialValue: this.sourceValue(props)
      };
    }

    isConnected(props) {
      if (this.props.name) return true;
      return false;
    }

    childProps(props) {
      return Object.assign({}, this.passthroughProps(props), this.additionalProps(props));
    }

    render() {
      const props = this.isConnected(this.props) ? this.childProps(this.props) : this.props;
      return React.createElement(WrappedComponent, props);
    }
  }

  return hoistStatics(Setter, WrappedComponent);

}
