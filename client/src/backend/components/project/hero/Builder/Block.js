import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Collapse from "global/components/Collapse";
import HeaderDetail from "./BlockHeaderDetail";

export default class Block extends PureComponent {
  static displayName = "Project.Hero.Builder.Block";

  static propTypes = {
    title: PropTypes.string.isRequired,
    titleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    onEdit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    ariaControls: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ariaExpanded: PropTypes.bool,
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

  get titleId() {
    return this.props.titleId;
  }

  get open() {
    return this.props.open;
  }

  get ariaExpanded() {
    return this.props.ariaExpanded;
  }

  get ariaControls() {
    return this.props.ariaControls;
  }

  get hasDisclosure() {
    return React.isValidElement(this.props.children);
  }

  render() {
    return (
      <div className="hero-builder-block full-width">
        {!this.hasDisclosure && (
          <button
            className="hero-builder-block__header"
            onClick={this.onEdit}
            aria-expanded={this.ariaExpanded}
            aria-controls={this.ariaControls}
          >
            <HeaderDetail
              title={this.title}
              titleId={this.titleId}
              description={this.description}
              hasDescription={this.hasDescription}
            />
          </button>
        )}
        {this.hasDisclosure && (
          <Collapse>
            <Collapse.Toggle className="hero-builder-block__header">
              <HeaderDetail
                title={this.title}
                titleId={this.titleId}
                description={this.description}
                hasDescription={this.hasDescription}
              />
            </Collapse.Toggle>
            <Collapse.Content
              id={this.ariaControls}
              isOpened={this.open}
              aria-hidden
            >
              <div className="hero-builder-block__body">
                {this.props.children}
              </div>
            </Collapse.Content>
          </Collapse>
        )}
      </div>
    );
  }
}
