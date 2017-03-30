import React, { PureComponent, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { entityEditorActions, entityStoreActions } from 'actions';
import { Developer } from 'components/global';
import { bindActionCreators } from 'redux';
import { entityUtils } from 'utils';
import { Form as GlobalForm } from 'components/global';
import get from 'lodash/get';
import has from 'lodash/has';
import isString from 'lodash/isString';
import JSONTree from 'react-json-tree';
import brackets2dots from 'brackets2dots';

const { select } = entityUtils;
const { request, flush } = entityStoreActions;

class FormContainer extends PureComponent {

  static displayName = "Form.Form";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.element
    ]),
    model: PropTypes.object,
    update: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    onSuccess: PropTypes.func,
    debug: PropTypes.bool,
    groupErrors: PropTypes.bool,
    groupErrorsStyle: PropTypes.object
  };

  static defaultProps = {
    model: {
      attributes: {}
    },
    debug: false,
    groupErrors: false
  }

  static mapStateToProps(state, ownProps) {
    return {
      routing: state.routing,
      session: get(state.entityEditor.sessions, ownProps.name),
      response: get(state.entityStore.responses, ownProps.name),
      errors: get(state.entityStore.responses, `${ownProps.name}.errors`)
    };
  }

  constructor(props) {
    super(props);
    this.preventDirtyWarning = false;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.routerWillLeave = this.routerWillLeave.bind(this);
  }

  componentDidMount() {
    this.maybeOpenSession(this.props);
    this.setRouterLeaveHook(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.model !== this.props.model) {
      this.openSession(nextProps.name, nextProps.model);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.maybeOpenSession(this.props);
  }

  componentWillUnmount() {
    this.closeSession(this.props);
    this.flushSave(this.props);
  }

  routerWillLeave(event) {
    if (this.props.session.changed !== true) return;
    if (this.preventDirtyWarning === true) return;
    return window.confirm("Changes you made may not be saved.");
  }

  setRouterLeaveHook(props) {
    if (!props.route) return;
    props.router.setRouteLeaveHook(props.route, this.routerWillLeave);
  }

  closeSession(props) {
    props.dispatch(entityEditorActions.close(props.name));
  }

  requestName(props) {
    return `editor-${props.name}`;
  }

  flushSave(props) {
    props.dispatch(entityStoreActions.flush(this.requestName(props)));
  }

  maybeOpenSession(props) {
    if (props.session) return;
    const model = props.model || {};
    this.openSession(props.name, model);
  }

  openSession(name, model = {}) {
    this.props.dispatch(entityEditorActions.open(name, model));
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
    const action = request(call, this.requestName(this.props));
    const res = this.props.dispatch(action);
    if (res.hasOwnProperty('promise') && this.props.onSuccess) {
      res.promise.then(() => {
        this.preventDirtyWarning = true;
        this.props.onSuccess();
      });
    }
  }

  create() {
    const dirty = this.props.session.dirty;
    const call = this.props.create({ attributes: dirty.attributes });
    const action = request(call, this.requestName(this.props));
    const res = this.props.dispatch(action);
    if (res.hasOwnProperty('promise') && this.props.onSuccess) {
      res.promise.then(() => {
        this.preventDirtyWarning = true;
        this.props.onSuccess(this.props.response.entity);
      });
    }
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
        set: bindActionCreators(entityEditorActions.set, props.dispatch),
      },
      dirtyModel: props.session.dirty,
      sourceModel: props.session.source,
      getModelValue: (name) => this.lookupValue(name, this.props),
      sessionKey: props.name,
      errors: props.errors || []
    };
  }

  renderDebugger() {
    if (!this.props.debug) return null;
    const debug = {
      session: this.props.session,
      errors: this.props.errors
    };
    return <Developer.Debugger object={debug} />;
  }

  render() {
    if (!this.props.session) return null;
    return (
      <div>
        {this.renderDebugger()}
        {this.props.groupErrors === true ?
          <GlobalForm.Errorable
            containerStyle={this.props.groupErrorsStyle}
            className="form-input"
            name="*"
            errors={this.props.errors}
          />
        : null}
        <form onSubmit={this.handleSubmit} className={this.props.className} >
          {this.renderChildren(this.props)}
        </form>
      </div>
    );
  }
}

const Form = connect(
  FormContainer.mapStateToProps
)(FormContainer);

export default withRouter(Form);

