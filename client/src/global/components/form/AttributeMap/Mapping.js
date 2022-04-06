import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import classNames from "classnames";
import { Droppable } from "react-beautiful-dnd";
import Attribute from "./Attribute";
import isNil from "lodash/isNil";

class FormColumnMapMapping extends PureComponent {
  static displayName = "Form.ColumnMap.Mapping";

  static propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    match: PropTypes.string,
    unLink: PropTypes.func,
    t: PropTypes.func
  };

  render() {
    const { match } = this.props;

    return (
      <div className={`mapping ${match ? "matched" : ""}`}>
        <div className="column-label">
          {this.props.name ? (
            <span className="truncate">{this.props.name}</span>
          ) : (
            <span className="truncate">&nbsp;</span>
          )}
        </div>
        <Droppable droppableId={this.props.id} isDropDisabled={!isNil(match)}>
          {(provided, snapshot) => {
            // Set a class if element is being dragged over
            const wellClass = classNames("well", {
              "drag-over": snapshot.isDraggingOver,
              matched: match
            });

            return (
              <div className={wellClass} ref={provided.innerRef}>
                {this.props.match ? (
                  <Attribute
                    name={this.props.match}
                    index={this.props.index}
                    unLink={this.props.unLink}
                    mapping={this.props.name}
                  />
                ) : null}
                <span className="placeholder">
                  {this.props.t("forms.atattribute_map.placeholder")}
                </span>
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </div>
    );
  }
}

export default withTranslation()(FormColumnMapMapping);
