import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from 'classnames';

import { Droppable } from 'react-beautiful-dnd';
import Column from './Column';

export default class FormColumnMapMapping extends PureComponent {
  static displayName = "Form.ColumnMap.Mapping"

  static propTypes = {
    name: PropTypes.string.isRequired,
    match: PropTypes.string,
    unLink: PropTypes.func,
  }

  render() {
    const { match } = this.props;

    return(
      <div
        className={`mapping ${match ? 'matched' : ''}`}
      >
        <div className="column-label">
          <span className="truncate">
            {this.props.name}
          </span>
        </div>
        <Droppable
          droppableId={this.props.name}
          isDropDisabled={match}
        >
          {(provided, snapshot) => {
            // Set a class if element is being dragged over
            const wellClass = classNames('well', {
                'drag-over': snapshot.isDraggingOver,
                'matched': match,
            });

            return (
              <div
                className={wellClass}
                ref={provided.innerRef}
              >
                {this.props.match ?
                  <Column
                    name={this.props.match}
                    unLink={this.props.unLink}
                    mapping={this.props.name}
                  >
                  </Column> : null
                }
                <span
                  className="placeholder"
                >
                  {'Drag column here...'}
                </span>
              </div>
            );
          }}
        </Droppable>
      </div>
    )
  }
}
