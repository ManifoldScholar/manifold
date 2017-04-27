import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import { isPromise } from 'utils/promise';

export default class AnnotationShareEditor extends PureComponent {

  static displayName = "Annotation.Share.Citation";

  static propTypes = {
    cancel: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);

    this.state = {
      style: "mla",
      citation: ""
    };
    this.handleCitationChange = this.handleCitationChange.bind(this);
  }

  componentDidMount() {
    this.ci.focus();
    this.state.citation = this.formatCitation(this.state.style);
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

  setStyle(event, style) {
    this.setState({ style: style });
    this.formatCitation(style);
  }

  handleCitationChange(event) {
    this.setState({ citation: event.target.value });
  }

  formatCitation(style) {
    switch (style) {
      case "mla":
        return this.setState({ citation: this.formatMla() });
        break;
      case "aba":
        return this.setState({ citation: this.formatAba() });
        break;
      case "chicago":
        return this.setState({ citation: this.formatChicago() });
        break;
      default:
        return "";
        break;
    }
  }

  formatMla() {
    return "MLA";
  }

  formatAba() {
    return "ABA";
  }

  formatChicago() {
    return "Chicago";
  }

  renderStyleButtons() {
    const styles = ["mla", "aba", "chicago"];
    let out = [];
    styles.forEach((style) => {
      out.push(
        <li key={style}>
          <button
            className={this.state.style === style ? "active" : null}
            onClick={(event) => this.setStyle(event, style)}
          >
            {style}
          </button>
        </li>
      )
    });
    return out;
  }

  render() {
    return (
      <div className="annotation-editor citation">
        <div>
          <nav className="utility">
            <label>Citation Style:</label>
            <ul>
              {this.renderStyleButtons()}
            </ul>
          </nav>
          <textarea
            ref={(ci) => { this.ci = ci; }}
            style={{ width: "100%" }}
            onChange={this.handleCitationChange}
            value={this.state.citation}
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
