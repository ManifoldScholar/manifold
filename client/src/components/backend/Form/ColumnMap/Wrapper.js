import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import Mapping from './Mapping';
import Column from './Column';

export default class FormColumnMap extends PureComponent {
  static displayName = "Form.ColumnMap"
  static propTypes = {
    mappings: PropTypes.object,
    columns: PropTypes.array,
  };

  // Stub column data
  static defaultProps = {
    mappings: {
      'title': null,
      'kind': null,
      'description': null,
      'Honorificabilitudinitatibus': null,
      'hapax legomenon': null,
      'external video': null,
      'short': null,
    },
    columns: [
      'Title',
      'Description',
      'File',
      'External Video?',
      'Link URL',
      'Minimum Width',
      'Minimum Height',
      'iFrame URL',
    ]
  }

  constructor(props) {
    super();

    this.state = {
      dragging: false,
      mappings: props.mappings,
      availableColumns: props.columns.sort()
    }
  }

  onDragStart = () => {
    this.setState({
      dragging: true
    });
  }

  onDragEnd = (result) => {
    // Stop dragging
    this.setState({
      dragging: false
    });

    // NB: This is for UI demo purposes,
    // Appending of mappins will likely happen higher up in the end

    // Destination can only be one of the mappings
    if(result.destination) {
      const newMap = {};

      // If source is available columns, remove from that source
      if (result.source.droppableId === 'columnsAvailable') {
        this.setState({
          availableColumns: this.state.availableColumns.filter((col) => {
            return col !== result.draggableId;
          })
        });
      } else {
        // Otherwise, remove it from the mapping
        newMap[result.source.droppableId] = null;
      }

      // Destination is keyed with the name of the file title.
      // Update mappings with match.
      this.setState({
        mappings: Object.assign(
          {},
          this.state.mappings,
          newMap,
          {[result.destination.droppableId]: result.draggableId}
        )
      });
    }
  }

  unLinkMatch = (mapping, column) => {
    // Remove column from mapping, add it back to available
    this.setState({
      availableColumns:
        [column].concat(this.state.availableColumns).sort(),
      mappings: Object.assign(
        {},
        this.state.mappings,
        {[mapping]: null}
      )
    })
  };

  render() {
    const {availableColumns, mappings} = this.state;
    const mapKeys = Object.keys(mappings);

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <div className="form-input">
          <div className="form-column-map">
            <div className="column column-mappable">
              <label>
                {'Mapped Columns'}
              </label>
              <ul
                className="mappable"
              >
                {mapKeys.map((title, index) => {
                  return(
                    <li
                      key={index}
                    >
                      <Mapping
                        name={title}
                        match={mappings[title]}
                        unLink={this.unLinkMatch}
                      >
                      </Mapping>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="column column-available">
              <label>
                {'Available Fields'}
              </label>
              <Droppable
                droppableId="columnsAvailable"
                isDropDisabled
              >
                {(provided, snapshot) => (
                  <div
                    className="available"
                    ref={provided.innerRef}
                  >
                    {availableColumns.map((column) => {
                      return(
                        <Column
                          key={column}
                          name={column}
                        >
                        </Column>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </DragDropContext>
    );
  }
}
