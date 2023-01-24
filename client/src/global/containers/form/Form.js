import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import { entityEditorActions, entityStoreActions } from "actions";
import GlobalForm from "global/components/form";
import Developer from "global/components/developer";
import { bindActionCreators } from "redux";
import get from "lodash/get";
import has from "lodash/has";
import forEach from "lodash/forEach";
import isFunction from "lodash/isFunction";
import pick from "lodash/pick";
import brackets2dots from "brackets2dots";
import { Prompt } from "react-router-dom";
import { FormContext } from "helpers/contexts";
import isArray from "lodash/isArray";
import isNil from "lodash/isNil";
import * as Styled from "./styles";

const { request, flush } = entityStoreActions;
const { close, open, set } = entityEditorActions;

export class FormContainer extends PureComponent {
  static mapStateToProps = (state, ownProps) => {
    return {
      session: get(state.entityEditor.sessions, ownProps.name),
      response: get(state.entityStore.responses, ownProps.name),
      errors: get(state.entityStore.responses, `${ownProps.name}.errors`)
    };
  };

  static displayName = "Form.Form";

  static propTypes = {
    doNotWarn: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.array,
      PropTypes.element
    ]),
    style: PropTypes.object,
    model: PropTypes.object,
    formatData: PropTypes.func,
    onDirty: PropTypes.func,
    update: PropTypes.func,
    create: PropTypes.func,
    name: PropTypes.string.isRequired,
    onSuccess: PropTypes.func,
    debug: PropTypes.bool,
    groupErrors: PropTypes.bool,
    suppressModelErrors: PropTypes.bool,
    groupErrorsStyle: PropTypes.object,
    session: PropTypes.object,
    errors: PropTypes.array,
    response: PropTypes.object,
    className: PropTypes.string,
    options: PropTypes.object,
    flushOnUnmount: PropTypes.bool,
    notificationScope: PropTypes.string,
    t: PropTypes.func
  };

  static defaultProps = {
    style: {},
    doNotWarn: false,
    notificationScope: "global",
    model: {
      attributes: {},
      relationships: {}
    },
    className: "form-secondary",
    debug: false,
    groupErrors: false,
    suppressModelErrors: false,
    flushOnUnmount: true,
    modelName: "This model",
    options: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      preventDirtyWarning: false,
      submitKey: null,
      submitRequested: false
    };
  }

  componentDidMount() {
    this.maybeOpenSession(this.props);
  }

  componentDidUpdate(prevProps, prevState) {
    this.maybeOpenSession(this.props, prevProps);
    if (this.state.submitRequested && !prevState.submitRequested)
      this.handleSubmit();
    if (this.props.onDirty) this.props.onDirty(this.props.session.dirty);
  }

  componentWillUnmount() {
    this.closeSession(this.props);
    this.flushSave(this.props);
  }

  closeSession(props) {
    props.dispatch(close(props.name));
  }

  flushSave(props) {
    if (props.flushOnUnmount) props.dispatch(flush(props.name));
  }

  maybeOpenSession(props, prevProps = {}) {
    const model = props.model || {};

    if (prevProps.model !== props.model) {
      return this.openSession(props.name, model);
    }
    if (props.session) return null;
    this.openSession(props.name, model);
  }

  openSession(name, model = {}) {
    this.props.dispatch(open(name, model));
  }

  handleSubmit = (event = null) => {
    if (event) event.preventDefault();
    this.setState({ submitKey: this.createKey() });
    if (this.props.session.source.id) {
      this.update();
    } else {
      this.create();
    }
    this.setState({ submitRequested: false });
  };

  createKey() {
    const keyLength = 6;
    return Math.random()
      .toString(36)
      .substr(2, keyLength);
  }

  adjustedRelationships(relationships) {
    if (!relationships) return {};
    const adjusted = { ...relationships };

    forEach(adjusted, (value, key) => {
      if (isNil(value)) {
        adjusted[key] = null;
      } else {
        const adjustedValue = isArray(value)
          ? value.map(relation => pick(relation, ["id", "type", "_remove"]))
          : pick(value, ["id", "type", "_remove"]);
        adjusted[key] = {
          data: adjustedValue
        };
      }
    });

    return adjusted;
  }

  update() {
    const dirty = this.props.session.dirty;
    const source = this.props.session.source;
    if (!this.props.update) return;

    const args = this.props.formatData
      ? this.props.formatData(dirty, source)
      : {
          attributes: dirty.attributes,
          relationships: this.adjustedRelationships(dirty.relationships)
        };

    const call = this.props.update(source.id, args);

    const action = request(call, this.props.name, this.requestOptions());
    const res = this.props.dispatch(action);
    if (res.hasOwnProperty("promise")) {
      res.promise.then(
        data => {
          this.setState({ preventDirtyWarning: true }, () => {
            if (this.props.onSuccess)
              this.props.onSuccess(this.props.response.entity, data);
          });
        },
        err => {
          if (this.props.onError) {
            this.props.onError(err);
          }
        }
      );
    }
  }

  requestOptions() {
    return {
      ...this.props.options,
      notificationScope: this.props.notificationScope
    };
  }

  create() {
    const { dirty, source } = this.props.session;
    const callMethod = this.props.create || this.props.update || null;
    if (!callMethod) return;

    const args = this.props.formatData
      ? this.props.formatData(dirty, source)
      : {
          attributes: { ...source.attributes, ...dirty.attributes },
          relationships: this.adjustedRelationships(dirty.relationships)
        };
    const call = callMethod(args);

    const action = request(call, this.props.name, this.requestOptions());
    const res = this.props.dispatch(action);

    if (res.hasOwnProperty("promise")) {
      res.promise.then(
        data => {
          this.setState({ preventDirtyWarning: true }, () => {
            if (this.props.onSuccess)
              this.props.onSuccess(this.props.response.entity, data);
          });
        },
        err => {
          if (this.props.onError) {
            this.props.onError(err);
          }
        }
      );
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

  triggerSubmit = () => {
    this.setState({ submitRequested: true });
  };

  contextProps = props => {
    const out = {
      actions: {
        set: bindActionCreators(set, props.dispatch)
      },
      dirtyModel: props.session.dirty,
      sourceModel: props.session.source,
      getModelValue: name => this.lookupValue(name, this.props),
      sessionKey: props.name,
      submitKey: this.state.submitKey,
      triggerSubmit: this.triggerSubmit,
      styleType: props.className.includes("form-secondary")
        ? "secondary"
        : "primary"
    };
    if (!this.props.groupErrors) out.errors = props.errors || [];
    return out;
  };

  isBlocking() {
    if (this.props.doNotWarn === true) return false;
    if (this.state.preventDirtyWarning === true) return false;
    if (this.props.session.changed === true) return true;
    return false;
  }

  renderGroupedErrors(props) {
    if (!props.groupErrors || !props.errors) return null;
    return (
      <Styled.ErrorGroup
        containerStyle={props.groupErrorsStyle}
        name="*"
        errors={props.errors}
      />
    );
  }

  renderModelErrors(props) {
    if (props.groupErrors || !props.errors || props.suppressModelErrors)
      return null;
    return (
      <GlobalForm.Errorable
        name="attributes[base]"
        errors={props.errors}
        nameForError={props.modelName}
      />
    );
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
    const className = this.props.className.replace("form-secondary", "");

    const contextProps = this.contextProps(this.props);

    return (
      <>
        {this.renderDebugger()}

        <Prompt
          when={this.isBlocking()}
          message={this.props.t("messages.unsaved_changes")}
        />

        {this.renderGroupedErrors(this.props)}
        <Styled.Form
          ref={this.props.formRef}
          style={this.props.style}
          onSubmit={this.handleSubmit}
          className={className}
          data-id="submit"
        >
          <FormContext.Provider value={contextProps}>
            {isFunction(this.props.children)
              ? this.props.children(contextProps.getModelValue)
              : this.props.children}
          </FormContext.Provider>
          {this.renderModelErrors(this.props)}
        </Styled.Form>
      </>
    );
  }
}

export default withTranslation()(connectAndFetch(FormContainer));
