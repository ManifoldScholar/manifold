import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SortableContainer } from "react-sortable-hoc";
import ListItem from "./orderable-components/ListItem";
import classnames from "classnames";
import labelId from "helpers/labelId";

function cloneEntities(entities) {
  const source = entities || [];
  return source.slice(0);
}

export default class ListOrderable extends PureComponent {
  static propTypes = {
    entities: PropTypes.array,
    entityComponent: PropTypes.func.isRequired,
    entityComponentProps: PropTypes.object,
    orderChangeHandler: PropTypes.func.isRequired,
    dragHandle: PropTypes.bool,
    listClassNames: PropTypes.string,
    listItemClassNames: PropTypes.string,
    id: PropTypes.string
  };

  static defaultProps = {
    dragHandle: false,
    id: labelId("list-orderable-")
  };

  constructor(props) {
    super(props);
    this.state = {
      orderedEntities: cloneEntities(props.entities),
      ref: props.entities
    };
  }

  static getDerivedStateFromProps(props, prevState) {
    if (props.entities === prevState.ref) return null;

    const orderedEntities = cloneEntities(props.entities);
    return { orderedEntities, ref: props.entities };
  }

  getAdjustedPosition(position) {
    const entityCount = this.state.orderedEntities.length;

    if (position <= 0) return "top";
    if (position >= entityCount) return "bottom";
    return position + 1;
  }

  setOrderByChange(oldPos, newPos) {
    const ordered = Array.from(this.state.orderedEntities);
    const [removed] = ordered.splice(oldPos, 1);
    ordered.splice(newPos, 0, removed);

    return ordered;
  }

  handleListOrderChange = result => {
    if (!result) return null;

    const entity = this.state.orderedEntities[result.oldIndex];
    if (!entity) return null;

    this.setState(
      {
        orderedEntities: this.setOrderByChange(result.oldIndex, result.newIndex)
      },
      () => {
        const adjustedPosition = this.getAdjustedPosition(result.newIndex);

        this.props.orderChangeHandler({
          id: entity.id,
          position: adjustedPosition
        });
      }
    );
  };

  render() {
    if (!this.state.orderedEntities) return null;

    const listClasses = classnames(this.props.listClassNames, {
      "list-orderable": true,
      "with-handle": this.props.dragHandle
    });

    const List = SortableContainer(({ entities }) => {
      return (
        <ul className={listClasses}>
          {entities.map((entity, index) => {
            const id = `${this.props.id}${entity.id}`;
            return (
              <ListItem
                key={id}
                entity={entity}
                ordinal={index}
                {...this.props}
              />
            );
          })}
        </ul>
      );
    });

    return (
      <List
        entities={this.state.orderedEntities}
        helperClass="dragging"
        useDragHandle={this.props.dragHandle}
        onSortEnd={this.handleListOrderChange}
        axis={"xy"}
      />
    );
  }
}
