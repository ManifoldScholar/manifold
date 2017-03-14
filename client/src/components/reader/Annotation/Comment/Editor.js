import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

export default class AnnotationCommentEditor extends PureComponent {

  static displayName = "Annotation.Comment.Editor";

  static propTypes = {
    body: PropTypes.string,
    cancel: PropTypes.func,
    saveHandler: PropTypes.func
  }

  constructor(props) {
    super(props);

    this.handleBodyChange = this.handleBodyChange.bind(this);
    // NB This function will likely exist and need to be bound
    // this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      body: props.body ? props.body : "",
      isPrivate: false
    };
  }

  // handleSubmit(event) {
  //   event.preventDefault();
  //   this.props.createHandler(this.state.body, this.state.isPrivate);
  // }

  handleBodyChange(event) {
    this.setState({ body: event.target.value });
  }

  render() {

    const checkClass = classNames(
        'form-toggle',
        'checkbox',
        { checked: this.state.isPrivate }
    );

    const textClass = classNames({
      expanded: this.state.body
    });

    return (
      <div className="comment-editor">
      <textarea
          className={textClass}
          placeholder={'Reply to this annotation...'}
          onChange={this.handleBodyChange}
          value={this.state.body}
      />
        <div className="utility">
          <div className="buttons">
            <button
                onClick={this.props.cancel}
                className="button-secondary-dull"
            >
              Cancel
            </button>
            <button
                className="button-secondary"
                disabled={!this.state.body}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    );
  }
}
