import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Mapping from "./Mapping";
import Instructions from "../Instructions";
import Attribute from "./Attribute";
import setter from "../setter";
import omitBy from "lodash/omitBy";
import difference from "lodash/difference";

const sortAttributes = props => {
  const attributes = Object.values(props.getModelValue(props.attributes));
  const unavailableAttributes = Object.values(props.value);
  return attributes.filter(c => !unavailableAttributes.includes(c)).sort();
};

const sortHeaders = props => {
  const headers = props.getModelValue(props.headers);
  return Object.values(headers).map((header, index) => {
    if (header) return header;
    return `Column #${index + 1}`;
  });
};

class FormColumnMap extends PureComponent {
  static displayName = "Form.ColumnMap";
  static propTypes = {
    set: PropTypes.func.isRequired,
    instructions: PropTypes.string.isRequired,
    getModelValue: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState) return null;
    const nextAttributes = sortAttributes(nextProps);
    if (difference(prevState.sortedAttributes, nextAttributes)) {
      return {
        sortedAttributes: nextAttributes
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      sortedHeaders: sortHeaders(props),
      sortedAttributes: sortAttributes(props)
    };
  }

  onDragEnd = result => {
    if (!result.destination) return;
    const currentMap = this.props.value;
    const headerPosition = result.destination.droppableId;
    const column = result.draggableId;
    const updated = omitBy(currentMap, value => value === column);
    updated[headerPosition] = column;
    this.props.set(updated);
  };

  getHeaderPosition(header, props) {
    const headers = props.getModelValue(props.headers);
    return Object.keys(headers).find(key => headers[key] === header);
  }

  getCurrentMapping = position => {
    return this.props.value[position] || null;
  };

  autoMap = event => {
    event.preventDefault();
    this.props.set(this.props.getModelValue("attributes[columnAutomap]"));
  };

  unLinkMatch = (mapping, column) => {
    const currentMap = this.props.value;
    const updated = omitBy(currentMap, value => value === column);
    this.props.set(updated);
  };

  /* eslint-disable react/no-array-index-key */
  render() {
    const { sortedAttributes, sortedHeaders } = this.state;
    return (
      <div>
        <Instructions
          className="space-bottom"
          instructions={this.props.instructions}
        />
        <div className="form-input">
          <button onClick={this.autoMap} className="button-secondary outlined">
            {"Automatically Map Attributes"}
          </button>
        </div>
        <DragDropContext
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        >
          <div className="form-input">
            <div className="form-column-map">
              <div className="column column-mappable">
                <h4 className="column-heading">{"Spreadsheet Columns"}</h4>
                <ul className="mappable">
                  {sortedHeaders.map((header, index) => {
                    const position = this.getHeaderPosition(header, this.props);
                    const id = position || (index + 1).toString();
                    return (
                      <li key={index}>
                        <Mapping
                          name={header}
                          id={id}
                          match={this.getCurrentMapping(id)}
                          unLink={this.unLinkMatch}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="column column-available">
                <h4 className="column-heading">{"Available Attributes"}</h4>
                <Droppable droppableId="attributesAvailable" isDropDisabled>
                  {(provided, snapshotIgnored) => (
                    <div className="available" ref={provided.innerRef}>
                      {sortedAttributes.map(attribute => {
                        return <Attribute key={attribute} name={attribute} />;
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>
    );
  }
  /* eslint-enable react/no-array-index-key */
}

export default setter(FormColumnMap);
