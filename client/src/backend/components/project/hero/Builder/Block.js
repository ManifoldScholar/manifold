import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import { UnmountClosed as Collapse } from "react-collapse";

export default class Block extends PureComponent {
  static displayName = "Project.Hero.Builder.Block";

  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    onEdit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  static defaultProps = {
    open: true
  };

  onEdit = event => {
    event.preventDefault();
    this.props.onEdit();
  };

  get hasDescription() {
    return !!this.props.description;
  }

  get description() {
    return this.props.description;
  }

  get title() {
    return this.props.title;
  }

  get open() {
    return this.props.open;
  }

  render() {
    return (
      <div className="hero-builder-block full-width">
        <div
          className="hero-builder-block__header"
          role="button"
          onClick={this.onEdit}
        >
          <div className="hero-builder-block__header-details">
            <h3 className="hero-builder-block__title">{this.title}</h3>
            {this.hasDescription && (
              <p className="hero-builder-block__description">
                {this.description}
              </p>
            )}
          </div>
          <button className="hero-builder-block__button">
            <span className="hero-builder-block__button-label">Edit</span>
            <Utility.IconComposer icon="annotate32" size={26} />
          </button>
        </div>
        <Collapse isOpened={this.open}>
          <div className="hero-builder-block__body">{this.props.children}</div>
        </Collapse>
      </div>
    );
  }
}
