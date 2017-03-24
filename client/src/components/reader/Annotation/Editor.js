import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { isPromise } from 'utils/promise';
import { Form as GlobalForm } from 'components/global';

export default class AnnotationSelectionEditor extends PureComponent {

  static displayName = "Annotation.Selection.Editor";

  static propTypes = {
    id: PropTypes.string,
    body: PropTypes.string,
    isPrivate: PropTypes.bool,
    subject: PropTypes.string.isRequired,
    startNode: PropTypes.string.isRequired,
    startChar: PropTypes.number.isRequired,
    endNode: PropTypes.string.isRequired,
    endChar: PropTypes.number.isRequired,
    cancel: PropTypes.func.isRequired,
    saveHandler: PropTypes.func.isRequired,
    closeOnSave: PropTypes.bool,
    addsTo: PropTypes.string
  }

  constructor(props) {
    super(props);

    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.handlePrivacyChange = this.handlePrivacyChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.state = {
      body: "",
      isPrivate: false,
      errors: []
    };

    if (props.body) this.state.body = props.body;
    if (props.private) this.state.isPrivate = props.private;
  }

  componentDidMount() {
    this.ci.focus();
  }

  handleSubmit(event) {
    event.preventDefault();
    const { subject, startNode, startChar, endNode, endChar } = this.props;
    const { body, isPrivate } = this.state;
    const annotation = {
      subject,
      startNode,
      startChar,
      endNode,
      endChar,
      body,
      // eslint-disable-next-line quote-props
      "private": isPrivate,
      format: "annotation"
    };
    if (this.props.id) annotation.id = this.props.id;
    const options = { closeOnSave: this.props.closeOnSave };
    if (this.props.addsTo) options.addsTo = this.props.addsTo;
    const promise = this.props.saveHandler(annotation, options);
    if (isPromise(promise)) {
      promise.then(() => {
        this.props.cancel();
      }, (response) => {
        this.handleErrors(response.body.errors);
      });
    }
  }

  handleBodyChange(event) {
    this.setState({ body: event.target.value });
  }

  handleCancel(event) {
    event.preventDefault();
    if (this.props.cancel) {
      this.props.cancel(event);
    }
  }

  handlePrivacyChange(event) {
    const value = !this.state.isPrivate;
    this.setState({ isPrivate: value });
  }

  handleErrors(errors) {
    this.setState({ errors });
  }

  render() {

    const checkClass = classNames(
      'form-toggle',
      'checkbox',
      { checked: this.state.isPrivate }
    );

    return (
      <div className="annotation-editor">
        <form onSubmit={this.handleSubmit}>
          <GlobalForm.Errorable
            name="attributes[body]"
            errors={this.state.errors}
          >
            <textarea
              ref={(ci) => { this.ci = ci; }}
              style={{ width: "100%" }}
              placeholder={'Annotate this passage...'}
              onChange={this.handleBodyChange}
              value={this.state.body}
            />
          </GlobalForm.Errorable>
          <div className="utility">
            <div className="form-input">
              <label className={checkClass} >
                <input
                  type="checkbox"
                  name="isPrivate"
                  value="1"
                  checked={this.state.isPrivate}
                  onChange={this.handlePrivacyChange}
                />
                <span className="toggle-indicator">
                <i className="manicon manicon-check-bold"></i>
              </span>
                <span className="toggle-label">This Annotation is Private</span>
              </label>
            </div>
            <div className="buttons">
              <button
                onClick={this.handleCancel}
                className="button-primary dull"
              >
                Cancel
              </button>
              <button
                className="button-secondary"
                disabled={!this.state.body}
              >
                Save
              </button>
            </div>
          </div>

        </form>
      </div>
    );
  }

}
