import React, { PureComponent, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { entityEditorActions, entityStoreActions } from 'actions';
import { bindActionCreators } from 'redux';
import { entityUtils } from 'utils';
import get from 'lodash/get';
import JSONTree from 'react-json-tree'

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
    debug: PropTypes.bool
  };

  static defaultProps = {
    model: {
      attributes: {}
    },
    debug: false
  }

  static mapStateToProps(state, ownProps) {
    return {
      routing: state.routing,
      session: get(state.entityEditor.sessions, ownProps.name),
      response: get(state.entityStore.responses, `editor-${ownProps.name}`),
      errors: get(state.entityStore.responses, `editor-${ownProps.name}.errors`)
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

  handleSubmit(event) {
    event.preventDefault();
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
      return React.cloneElement(child, childProps);
    });
  }

  childProps(props) {
    return {
      actions: {
        set: bindActionCreators(entityEditorActions.set, props.dispatch),
      },
      dirtyModel: props.session.dirty,
      sourceModel: props.session.source,
      sessionKey: props.name,
      errors: props.errors || []
    };
  }

  renderDebugger() {
    if (!__DEVELOPMENT__) return null;
    if (!this.props.debug) return null;
    const theme = {
      scheme: 'green screen',
      author: 'chris kempson (http://chriskempson.com)',
      base00: '#001100',
      base01: '#003300',
      base02: '#005500',
      base03: '#007700',
      base04: '#009900',
      base05: '#00bb00',
      base06: '#00dd00',
      base07: '#00ff00',
      base08: '#007700',
      base09: '#009900',
      base0A: '#007700',
      base0B: '#00bb00',
      base0C: '#005500',
      base0D: '#009900',
      base0E: '#00bb00',
      base0F: '#005500'
    }
    const advanced = {
      extend: theme,
      tree: {
        padding: 20,
        margin: 0
      }
    }
    return (
      <div style={{
        marginBottom: 15
      }}>
        <div style={{
          backgroundColor: "rgb(0, 17, 0)",
          color: "rgb(0, 153, 0)",
          margin: 0,
          padding: "10px 20px",
          display: "inline-block"
        }}>Form Debugger</div>
        <JSONTree hideRoot={true} theme={advanced} invertTheme={false} data={this.props.session} />
      </div>
    )
  }


  render() {
    if (!this.props.session) return null;
    return (
      <div>
        {this.renderDebugger()}
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

