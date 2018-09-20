import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";

export default class FormHasManyList extends PureComponent {
  static displayName = "Form.HasMany.List";

  static propTypes = {
    entity: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
      .isRequired,
    entities: PropTypes.array,
    entityAvatarAttribute: PropTypes.string,
    ordinal: PropTypes.number,
    entityName: PropTypes.func,
    label: PropTypes.string,
    orderable: PropTypes.bool,
    removeHandler: PropTypes.func.isRequired,
    moveHandler: PropTypes.func,
    editHandler: PropTypes.func
  };

  onRemove = event => {
    return this.props.removeHandler(event, this.props.entity);
  };

  onEdit = event => {
    event.preventDefault();
    return this.props.editHandler(this.props.entity);
  };

  onMoveUp = event => {
    return this.props.moveHandler(event, this.props.entity, "up");
  };

  onMoveDown = event => {
    return this.props.moveHandler(event, this.props.entity, "down");
  };

  name() {
    return this.props.entityName(this.props.entity);
  }

  renderAvatar() {
    if (!this.props.entityAvatarAttribute) return null;
    const path = `${this.props.entityAvatarAttribute}.smallSquare`;
    const avatar = get(this.props.entity.attributes, path);

    return (
      <figure>
        {avatar ? (
          <img src={avatar} alt="User Avatar" />
        ) : (
          <div className="no-image">
            <i className="manicon manicon-person" aria-hidden="true" />
          </div>
        )}
      </figure>
    );
  }

  renderEditButton() {
    if (!this.props.editHandler) return null;

    return (
      <button className="manicon manicon-pencil-simple" onClick={this.onEdit}>
        <span className="screen-reader-text">
          Edit {this.name()}
          in the {this.props.label} list.
        </span>
      </button>
    );
  }

  renderRemoveButton() {
    return (
      <button onClick={this.onRemove} className="manicon manicon-x">
        <span className="screen-reader-text">
          Remove {this.name()} from the {this.props.label} list.
        </span>
      </button>
    );
  }

  renderOrderButton(direction, ordinal) {
    if (!this.props.orderable) return null;
    if (direction === "up" && ordinal === 0) return null;
    if (direction === "down" && ordinal === this.props.entities.length - 1)
      return null;

    const moveHandler = direction === "up" ? this.onMoveUp : this.onMoveDown;

    return (
      <button
        onClick={moveHandler}
        className={`manicon manicon-arrow-${direction}`}
      >
        <span className="screen-reader-text">
          {`Move ${this.name()} ${direction} in the ${this.props.label} list`}
        </span>
      </button>
    );
  }

  render() {
    const { entity, ordinal } = this.props;
    if (!entity) return null;

    return (
      <li>
        <div className="association">
          {this.renderAvatar()}
          <h4 className="association-name">{this.name()}</h4>
        </div>

        <div className="utility">
          {this.renderEditButton()}
          {this.renderOrderButton("up", ordinal)}
          {this.renderOrderButton("down", ordinal)}
          {this.renderRemoveButton()}
        </div>
      </li>
    );
  }
}
