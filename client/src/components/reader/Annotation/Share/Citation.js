import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import { isPromise } from 'utils/promise';

export default class AnnotationShareEditor extends PureComponent {

  static displayName = "Annotation.Share.Citation";

  static propTypes = {
    text: PropTypes.object.isRequired,
    cancel: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);

    this.state = {
      style: "mla",
      citation: "",
      copied: false
    };
    this.handleCitationChange = this.handleCitationChange.bind(this);
    this.handleCopyClick = this.handleCopyClick.bind(this);
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
    this.setState({ style, copied: false });
    this.formatCitation(style);
  }

  handleCitationChange(event) {
    this.setState({ citation: event.target.value, copied: false });
  }

  handleCopyClick(event) {
    event.preventDefault();
    const textarea = document.querySelector("textarea");
    textarea.select();
    const copiedText = document.execCommand("copy");
    if (!copiedText) return null;
    this.setState({ copied: true })
  }

  /* eslint-disable no-unreachable */
  formatCitation(style) {
    switch (style) {
      case "mla":
        return this.setState({ citation: this.formatMla() }); // eslint-disable no-unreachable
        break;
      case "apa":
        return this.setState({ citation: this.formatAba() }); // eslint-disable no-unreachable
        break;
      case "chicago":
        return this.setState({ citation: this.formatChicago() }); // eslint-disable no-unreachable
        break;
      default:
        return "";
        break;
    }
  }
  /* eslint-enable no-unreachable */

  /* eslint-disable no-unreachable */
  formatAttribute(attribute) {
    if (!this.props.text) return null;
    const attr = this.props.text.attributes;
    const meta = attr.metadata;
    switch (attribute) {
      case "author":
        return attr.creatorNames; // eslint-disable no-unreachable
        break;
      case "title":
        return attr.title; // eslint-disable no-unreachable
        break;
      case "contributers":
        break;
      case "number":
        return meta.number || ""; // eslint-disable no-unreachable
        break;
      case "publisher":
        return meta.publisher; // eslint-disable no-unreachable
        break;
      case "publicationDate":
        return attr.publicationDate; // eslint-disable no-unreachable
        break;
      case "placeOfPublication":
        return meta.placeOfPublication; // eslint-disable no-unreachable
        break;
      default:
        return null; // eslint-disable no-unreachable
        break;
    }
  }
  /* eslint-enable no-unreachable */

  formatMla() {
    return `${this.formatAttribute("author")}. ${this.formatAttribute("title")}. ${this.formatAttribute("number")} ${this.formatAttribute("publisher")}, ${this.formatAttribute("placeOfPublication")}.`;
  }

  formatAba() {
    return `${this.formatAttribute("author")}. (${this.formatAttribute("publicationDate")}) ${this.formatAttribute("title")}. ${this.formatAttribute("placeOfPublication")}: ${this.formatAttribute("publisher")}.`;
  }

  formatChicago() {
    return `${this.formatAttribute("author")}. ${this.formatAttribute("title")}. ${this.formatAttribute("placeOfPublication")}: ${this.formatAttribute("publisher")}. ${this.formatAttribute("publicationDate")}`;
  }

  renderStyleButtons() {
    const styles = ["mla", "apa", "chicago"];
    const out = [];
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
      );
    });
    return out;
  }

  render() {
    const copiedText = this.state.copied ? "Copied!" : null;

    return (
      <div className="annotation-editor citation">
        <div>
          <nav className="utility styles">
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
            <span className="notice">{copiedText}</span>
            <div className="buttons">
              <button
                onClick={this.handleCancel}
                className="button-primary dull"
              >
                Cancel
              </button>
              <button
                className="button-secondary"
                onClick={this.handleCopyClick}
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
