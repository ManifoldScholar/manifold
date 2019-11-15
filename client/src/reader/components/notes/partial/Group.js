import React, { Component } from "react";
import GroupItem from "./GroupItem";
import PropTypes from "prop-types";
import classNames from "classnames";
import debounce from "lodash/debounce";
import { UnmountClosed as Collapse } from "react-collapse";
import IconComposer from "global/components/utility/IconComposer";

export default class Group extends Component {
  static displayName = "Notes.Partial.Group";

  static propTypes = {
    readerSection: PropTypes.object,
    annotations: PropTypes.array,
    sectionName: PropTypes.string,
    visitHandler: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  componentDidMount() {
    this.preOpenItem();
  }

  preOpenItem = debounce(() => {
    const expanded =
      this.props.readerSection.attributes.name === this.props.sectionName;

    return this.setState({ expanded });
  }, 200);

  handleClick = event => {
    event.stopPropagation();
    return this.setState({ expanded: !this.state.expanded });
  };

  renderGroupItems(annotations) {
    const classes = classNames({
      "notes-filtered-list__group": true,
      "notes-filtered-list__group--expanded": this.state.expanded
    });

    return (
      <Collapse isOpened={this.state.expanded}>
        <ul className={classes}>
          {annotations.map(annotation => {
            return (
              <GroupItem
                key={annotation.id}
                annotation={annotation}
                visitHandler={this.props.visitHandler}
              />
            );
          })}
        </ul>
      </Collapse>
    );
  }

  render() {
    const iconClasses = classNames({
      "notes-filtered-list__disclosure-icon": true,
      "notes-filtered-list__disclosure-icon--expanded": this.state.expanded
    });
    return (
      <li className="notes-filtered-list__section">
        <button
          className="notes-filtered-list__section-button"
          onClick={this.handleClick}
          aria-expanded={this.state.expanded}
        >
          <div className="notes-filtered-list__section-button-inner">
            <IconComposer
              icon="disclosureDown24"
              size="default"
              iconClass={iconClasses}
            />
            <span className="notes-filtered-list__section-label">
              {this.props.sectionName}
            </span>
          </div>
        </button>
        {this.renderGroupItems(this.props.annotations)}
      </li>
    );
  }
}
