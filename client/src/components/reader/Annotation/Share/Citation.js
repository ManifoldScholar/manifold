import React, { PureComponent, PropTypes } from 'react';
import { isPromise } from 'utils/promise';

export default class AnnotationShareEditor extends PureComponent {

  static displayName = "Annotation.Share.Citation";

  static propTypes = {
    id: PropTypes.string,
    subject: PropTypes.string.isRequired,
    startNode: PropTypes.string.isRequired,
    startChar: PropTypes.number.isRequired,
    endNode: PropTypes.string.isRequired,
    endChar: PropTypes.number.isRequired,
    cancel: PropTypes.func.isRequired,
    closeOnSave: PropTypes.bool,
    addsTo: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);

    this.state = {
      body: "",
      errors: []
    };
  }

  componentDidMount() {
    this.ci.focus();
  }

  handleCancel(event) {
    event.preventDefault();
    if (this.props.cancel) {
      this.props.cancel(event);
    }
  }

  handleErrors(errors) {
    this.setState({ errors });
  }

  render() {

    return (
      <div className="annotation-editor">
        <div>
          <textarea
            ref={(ci) => { this.ci = ci; }}
            style={{ width: "100%" }}
            value={this.state.body}
          />
          <div className="utility">
            <div className="buttons">
              <button
                onClick={this.handleCancel}
                className="button-primary dull"
              >
                Cancel
              </button>
              <button
                className="button-secondary"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
