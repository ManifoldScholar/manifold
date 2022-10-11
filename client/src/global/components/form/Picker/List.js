import React, { PureComponent } from "react";
import List, * as EntitiesList from "backend/components/list/EntitiesList";
import Utility from "global/components/utility";
import has from "lodash/has";
import isFunction from "lodash/isFunction";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

export default class PickerListComponent extends PureComponent {
  static displayName = "Form.Picker.List";

  static propTypes = {};

  static defaultProps = {
    listStyle: "well"
  };

  get callbacks() {
    return this.props.callbacks;
  }

  get listCallbacks() {
    const out = {};
    if (this.canReorder) out.onReorder = this.callbacks.reorderSelection;
    return out;
  }

  get canRemove() {
    return has(this.callbacks, "removeSelection");
  }

  get canEdit() {
    return this.props.rowEditRoute;
  }

  get canReorder() {
    return this.props.reorderable && has(this.callbacks, "reorderSelection");
  }

  get resolvedRowComponent() {
    const { rowComponent } = this.props;
    if (isFunction(rowComponent)) return rowComponent;
    if (has(EntitiesList, rowComponent)) return EntitiesList[rowComponent];
  }

  editUrl(entity) {
    return lh.link(this.props.rowEditRoute, entity.id);
  }

  wrappedRowComponent = props => {
    const Row = this.resolvedRowComponent;

    const utility = (
      <>
        {this.canRemove && (
          <button
            type="button"
            className="entity-row__utility-button"
            onClick={event => {
              event.stopPropagation();
              event.preventDefault();
              this.callbacks.removeSelection(props.entity);
            }}
            aria-label="Remove selection"
          >
            <Utility.IconComposer icon="close32" size={26} />
          </button>
        )}
        {this.canEdit && (
          <Link
            type="button"
            className="entity-row__utility-button"
            to={this.editUrl(props.entity)}
          >
            <Utility.IconComposer icon="annotate32" size={26} />
          </Link>
        )}
      </>
    );

    return <Row {...props} clickable={false} utility={utility} />;
  };

  /* eslint-disable react/jsx-pascal-case */
  render() {
    return (
      <div className={this.props.className}>
        <List
          emptyMessage="None Added"
          listStyle={this.props.listStyle}
          sortableStyle="tight"
          callbacks={this.listCallbacks}
          entityComponent={this.wrappedRowComponent}
          entityComponentProps={this.props.rowProps}
          entities={this.props.entities}
        />
      </div>
    );
  }
  /* eslint-enable react/jsx-pascal-case */
}
