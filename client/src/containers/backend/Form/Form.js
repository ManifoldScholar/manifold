import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityEditorActions, entityStoreActions } from "actions";
import { Developer } from "components/global";
import { bindActionCreators } from "redux";
import { Form as GlobalForm } from "components/global";
import get from "lodash/get";
import has from "lodash/has";
import isString from "lodash/isString";
import brackets2dots from "brackets2dots";
import { Prompt } from "react-router-dom";

const { request, flush } = entityStoreActions;
const { close, open, set } = entityEditorActions;

export class FormContainer extends PureComponent {
  static displayName = "Form.Form";

  static propTypes = {
    doNotWarn: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
    model: PropTypes.object,
    update: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    onSuccess: PropTypes.func,
    debug: PropTypes.bool,
    groupErrors: PropTypes.bool,
    groupErrorsStyle: PropTypes.object,
    session: PropTypes.object,
    errors: PropTypes.array,
    response: PropTypes.object,
    className: PropTypes.string
  };

  static defaultProps = {
    doNotWarn: false,
    model: {
      attributes: {}
    },
    debug: false,
    groupErrors: false
  };

  static mapStateToProps(state, ownProps) {
    return {
      session: get(state.entityEditor.sessions, ownProps.name),
      response: get(state.entityStore.responses, ownProps.name),
      errors: get(state.entityStore.responses, `${ownProps.name}.errors`)
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      preventDirtyWarning: false
    };
    this.preventDirtyWarning = false;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.maybeOpenSession(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.model !== this.props.model) {
      this.openSession(nextProps.name, nextProps.model);
    }
  }

  componentDidUpdate(prevPropsIgnored, prevStateIgnored) {
    this.maybeOpenSession(this.props);
  }

  componentWillUnmount() {
    this.closeSession(this.props);
    this.flushSave(this.props);
  }

  closeSession(props) {
    props.dispatch(close(props.name));
  }

  flushSave(props) {
    props.dispatch(flush(props.name));
  }

  maybeOpenSession(props) {
    if (props.session) return;
    const model = props.model || {};
    this.openSession(props.name, model);
  }

  openSession(name, model = {}) {
    this.props.dispatch(open(name, model));
  }

  handleSubmit(event = null) {
    if (event) event.preventDefault();
    if (this.props.session.source.id) {
      this.update();
    } else {
      this.create();
    }
  }

  update() {
    const dirty = this.props.session.dirty;
    const source = this.props.session.source;
    const call = this.props.update(source.id, { attributes: dirty.attributes });
    const action = request(call, this.props.name);
    const res = this.props.dispatch(action);
    if (res.hasOwnProperty("promise") && this.props.onSuccess) {
      res.promise.then(() => {
        this.setState({ preventDirtyWarning: true }, () => {
          this.props.onSuccess();
        });
      });
    }
  }

  create() {
    const dirty = this.props.session.dirty;
    const call = this.props.create({ attributes: dirty.attributes });
    const action = request(call, this.props.name);
    const res = this.props.dispatch(action);
    if (res.hasOwnProperty("promise") && this.props.onSuccess) {
      res.promise.then(() => {
        this.setState({ preventDirtyWarning: true }, () => {
          this.props.onSuccess(this.props.response.entity);
        });
      });
    }
  }

  nameToPath(name) {
    return brackets2dots(name);
  }

  lookupValue(name, props) {
    const path = this.nameToPath(name);
    if (has(props.session.dirty, path)) {
      return get(props.session.dirty, path);
    }
    if (has(props.session.source, path)) {
      return get(props.session.source, path);
    }
    return null;
  }

  childProps(props) {
    return {
      actions: {
        set: bindActionCreators(set, props.dispatch)
      },
      dirtyModel: props.session.dirty,
      sourceModel: props.session.source,
      getModelValue: name => this.lookupValue(name, this.props),
      sessionKey: props.name,
      errors: props.errors || []
    };
  }
  isBlocking() {
    if (this.props.doNotWarn === true) return false;
    if (this.state.preventDirtyWarning === true) return false;
    if (this.props.session.changed === true) return true;
    return false;
  }

  renderDebugger() {
    if (!this.props.debug) return null;
    const debug = {
      session: this.props.session,
      errors: this.props.errors
    };
    return <Developer.Debugger object={debug} />;
  }

  renderChildren(props) {
    const childProps = this.childProps(props);
    return React.Children.map(props.children, child => {
      if (!child) return null;
      if (isString(child.type)) {
        return child;
      }
      return React.cloneElement(child, childProps);
    });
  }

  render() {
    if (!this.props.session) return null;
    return (
      <div>
        {this.renderDebugger()}

        <Prompt
          when={this.isBlocking()}
          message="You may have unsaved changes. Do you want to leave without saving your changes?"
        />

        {this.props.groupErrors === true && this.props.errors
          ? <GlobalForm.Errorable
              containerStyle={this.props.groupErrorsStyle}
              className="form-input form-error-grouped"
              name="*"
              errors={this.props.errors}
            />
          : null}
        <form
          onSubmit={this.handleSubmit}
          className={this.props.className}
          data-id="submit"
        >
          {this.renderChildren(this.props)}
        </form>
      </div>
    );
  }
}

export default connectAndFetch(FormContainer);
