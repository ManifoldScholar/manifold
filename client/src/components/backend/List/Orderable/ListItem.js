import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SortableElement } from "react-sortable-hoc";
import classnames from "classnames";
import labelId from "helpers/labelId";

export default class ListOrderableListItem extends PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    entityComponent: PropTypes.func.isRequired,
    entityComponentProps: PropTypes.object,
    ordinal: PropTypes.number.isRequired,
    listItemClassNames: PropTypes.string,
    id: PropTypes.string
  };

  static defaultProps = {
    id: labelId("orderable-list-item-")
  };

  render() {
    const { entity, ordinal } = this.props;
    const Component = this.props.entityComponent;
    const listItemClasses = classnames(this.props.listItemClassNames, {
      "orderable-list-item": true
    });

    const ListItem = SortableElement(({ sortableEntity }) => {
      return (
        <li className={listItemClasses}>
          <Component
            entity={sortableEntity}
            {...this.props.entityComponentProps}
          />
        </li>
      );
    });

    return <ListItem sortableEntity={entity} index={ordinal} />;
  }
}
