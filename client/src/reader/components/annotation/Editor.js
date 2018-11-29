import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import GlobalForm from "global/components/form";

export default class AnnotationEditor extends PureComponent {
  static displayName = "Annotation.Editor";

  static propTypes = {
    saveAnnotation: PropTypes.func.isRequired,
    annotation: PropTypes.object,
    cancel: PropTypes.func,
    closeOnSave: PropTypes.bool
  };

  static defaultProps = {
    closeOnSave: true,
    annotation: { attributes: {} }
  };

  constructor(props) {
    super(props);
    this.state = {
      format: "annotation",
      body: props.annotation.attributes.body || "",
      private: props.annotation.attributes.private || false,
      errors: []
    };
  }

  componentDidMount() {
    if (this.ci) this.ci.focus();
  }

  componentWillUnmount() {
    clearTimeout(this.focusTimeout);
  }

  handleSubmit = event => {
    event.preventDefault();
    const { closeOnSave, saveAnnotation, annotation } = this.props;
    const { errorsIgnored, ...attributes } = this.state;
    const updatedAnnotation = Object.assign({}, annotation, { attributes });
    const promise = saveAnnotation(updatedAnnotation);
    if (closeOnSave && promise) {
      promise.then(
        () => {
          this.handleCancel();
        },
        () => {}
      );
    }
    promise.catch(response => {
      this.handleErrors(response.body.errors);
    });
  };

  handleBodyChange = event => {
    this.setState({ body: event.target.value });
  };

  handleCancel = (event = null) => {
    if (event) event.preventDefault();
    if (this.props.cancel) {
      this.props.cancel(event);
    }
  };

  handlePrivacyChange = eventIgnored => {
    const value = !this.state.private;
    this.setState({ private: value });
  };

  handleErrors(errors) {
    this.setState({ errors });
  }

  render() {
    const checkClass = classNames("form-toggle", "checkbox", {
      checked: this.state.private
    });

    return (
      <div className="annotation-editor">
        <form onSubmit={this.handleSubmit}>
          <GlobalForm.Errorable
            name="attributes[body]"
            errors={this.state.errors}
            idForError="annotation-textarea-error"
          >
            <label htmlFor="annotation-textarea" className="screen-reader-text">
              Annotate this passage
            </label>
            <textarea
              ref={ci => {
                this.ci = ci;
              }}
              id="annotation-textarea"
              aria-describedby="annotation-textarea-error"
              style={{ width: "100%" }}
              placeholder={"Annotate this passage..."}
              onChange={this.handleBodyChange}
              value={this.state.body}
            />
          </GlobalForm.Errorable>
          <div className="utility">
            <div className="form-input">
              <label htmlFor="private-annotation" className={checkClass}>
                <input
                  type="checkbox"
                  id="private-annotation"
                  name="private"
                  value="1"
                  checked={this.state.private}
                  onChange={this.handlePrivacyChange}
                />
                <span className="toggle-indicator" aria-hidden="true">
                  <i className="manicon manicon-check-bold" />
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
              <button className="button-secondary" disabled={!this.state.body}>
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
