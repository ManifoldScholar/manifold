import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';

export default class AnnotationSelectionEditor extends PureComponent {

  static displayName = "Annotation.Selection.Editor";

  static propTypes = {
    annotation: PropTypes.object,
    selection: PropTypes.object,
    cancel: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.state = {
      body: ""
    };
  }

  handleBodyChange(event) {
    this.setState({ body: event.target.value });
  }

  render() {
    return (
      <div className="annotation-editor">
        <textarea
          style={{ width: "100%" }}
          placeholder={'Annotate this passage...'}
          onChange={this.handleBodyChange}
          value={this.state.body}
        />
        <div className="utility">
          <div className="form-input">
            <label className="form-toggle checkbox">
              <input type="checkbox"/>
              <span className="toggle-indicator">
                <i className="manicon manicon-check"></i>
              </span>
              <span className="toggle-label">This Annotation is Private</span>
            </label>
          </div>
          <div className="buttons">
            <button onClick={this.props.cancel} className="button-primary dull">Cancel</button>
            <button className="button-secondary" disabled={!this.state.body}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

}
