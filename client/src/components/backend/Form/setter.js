import React, { PropTypes } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import get from 'lodash/get';
import has from 'lodash/has';
import isNil from 'lodash/isNil';
import isBoolean from 'lodash/isBoolean';
import isString from 'lodash/isString';
import startsWith from 'lodash/startsWith';
import intersection from 'lodash/intersection';
import brackets2dots from 'brackets2dots';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function setter(WrappedComponent) {

  const displayName = `Form.Setter('${getDisplayName(WrappedComponent)})`;

  class Setter extends React.PureComponent {

    static displayName: displayName;
    static WrappedComponent: WrappedComponent;

    static propTypes = {
      sessionKey: PropTypes.string,
      dirtyModel: PropTypes.object,
      sourceModel: PropTypes.object,
      readFrom: PropTypes.string,
      name: PropTypes.string,
      actions: PropTypes.shape({
        set: PropTypes.func
      }).isRequired
    }

    static defaultProps = {
      actions: {
        set: () => { console.log(WrappedComponent, "No actions passed to setter."); }
      }
    }

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

    callbackChange(event, props) {
      const target = event.target;
      const value = target.value;
      this.setValue(value, props);
    }

    setValue(value, props, triggersDirty = true) {
      if (!this.isConnected(this.props)) return;
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

    /* eslint-disable no-return-assign */
    /* eslint-disable no-param-reassign */
    /* eslint-disable no-sequences */
    passthroughProps(props) {
      const passthrough = intersection(
        Object.keys(WrappedComponent.propTypes),
        Object.keys(props)
      );
      return passthrough.reduce((a, e) => (a[e] = props[e], a), {});
    }
    /* eslint-enable no-sequences */
    /* eslint-enable no-param-reassign */
    /* eslint-enable no-return-assign */

    additionalProps(props) {
      return {
        onChange: (event) => this.callbackChange(event, this.props),
        set: (value) => this.callbackSet(value, this.props),
        value: this.currentValue(this.props),
        initialValue: this.sourceValue(this.props)
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
