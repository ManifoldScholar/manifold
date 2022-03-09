import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";
import { withTranslation } from "react-i18next";

export class AnnotationShareEditor extends PureComponent {
  static displayName = "Annotation.Share.Citation";

  static propTypes = {
    section: PropTypes.object,
    cancel: PropTypes.func.isRequired,
    t: PropTypes.func
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

  setStyle = event => {
    this.setState({ style: event.target.value, copied: false });
  };

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

    return (
      <fieldset className="citation__radios">
        <legend className="citation__legend">
          {this.props.t("reader.menus.citation.citation_style")}
        </legend>
        {styles.map((style, index) => (
          <label
            key={style}
            className={classNames({
              citation__radio: true,
              "citation__radio--active": style === selected
            })}
          >
            <input
              value={style}
              name="citation-style"
              type="radio"
              checked={style === selected}
              onChange={this.setStyle}
              tabIndex={index === 0 ? 0 : -1}
              className="citation__input"
            />
            <span className="citation__label">{style}</span>
          </label>
        ))}
      </fieldset>
    );
  }

  render() {
    const copiedText = this.state.copied
      ? this.props.t("reader.menus.citation.copied")
      : null;
    const citations = this.props.section.attributes.citations;

    return (
      <div className="annotation-editor citation">
        <div>
          {this.renderStyleButtons()}
          <div
            className="citation__copyable"
            ref={ci => {
              this.ci = ci;
            }}
            style={{ width: "100%" }}
            dangerouslySetInnerHTML={{ __html: citations[this.state.style] }}
          />
          <div className="annotation-editor__actions">
            <span className="citation__notice">{copiedText}</span>
            <div className="annotation-editor__buttons annotation-editor__buttons--end">
              <button
                onClick={this.handleCancel}
                className="button-primary button-primary--dull"
              >
                <span className="button-primary__text">
                  {this.props.t("actions.cancel")}
                </span>
              </button>
              <button
                className="button-secondary"
                onClick={this.handleCopyClick}
              >
                <IconComposer
                  icon="copy24"
                  size="default"
                  className="button-secondary__icon"
                />
                <span className="button-secondary__text">
                  {this.props.t("reader.actions.copy")}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(AnnotationShareEditor);
