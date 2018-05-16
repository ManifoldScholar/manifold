import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class AnnotationShareEditor extends PureComponent {
  static displayName = "Annotation.Share.Citation";

  static propTypes = {
    section: PropTypes.object,
    cancel: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const citations = props.section.attributes.citations;
    const styles = Object.keys(citations);

    this.state = {
      style: styles[0],
      copied: false
    };
  }

  componentDidMount() {
    this.ci.focus();
  }

  setStyle(_event, style) {
    this.setState({ style, copied: false });
  }

  handleCancel = event => {
    event.preventDefault();
    if (this.props.cancel) {
      this.props.cancel(event);
    }
  };

  handleCitationChange = event => {
    this.setState({ citation: event.target.value, copied: false });
  };

  handleCopyClick = event => {
    event.preventDefault();
    const range = document.createRange();
    range.selectNode(this.ci);
    window.getSelection().addRange(range);
    const copiedText = document.execCommand("copy");
    if (!copiedText) return null;
    this.setState({ copied: true });
  };

  renderStyleButtons() {
    const citations = this.props.section.attributes.citations;
    const styles = Object.keys(citations);
    const selected = this.state.style;
    return styles.map(style => {
      return (
        <li key={style}>
          <button
            className={selected === style ? "active" : null}
            onClick={event => this.setStyle(event, style)}
          >
            {style}
          </button>
        </li>
      );
    });
  }

  render() {
    const copiedText = this.state.copied ? "Copied!" : null;
    const citations = this.props.section.attributes.citations;

    return (
      <div className="annotation-editor citation">
        <div>
          <nav className="utility styles">
            <label>Citation Style:</label>
            <ul>{this.renderStyleButtons()}</ul>
          </nav>
          <div
            className="copyable"
            ref={ci => {
              this.ci = ci;
            }}
            style={{ width: "100%" }}
            dangerouslySetInnerHTML={{ __html: citations[this.state.style] }}
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
                className="button-secondary button-icon-secondary"
                onClick={this.handleCopyClick}
              >
                <i className="manicon manicon-copy" aria-hidden="true" />
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
