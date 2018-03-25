import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ListSimpleList extends PureComponent {
  static displayName = "List.SimpleList";

  static propTypes = {
    entities: PropTypes.array,
    entityComponent: PropTypes.func.isRequired,
    entityComponentProps: PropTypes.object,
    emptyListComponent: PropTypes.func,
    destroyHandler: PropTypes.func,
    title: PropTypes.string,
    icon: PropTypes.string
  };

  // Can take either a builder function that returns JSX or
  // a component class as this.props.entityComponent
  renderEntity = entity => {
    const props = Object.assign({}, this.props.entityComponentProps);
    props.key = entity.id;
    props.entity = entity;
    if (this.props.destroyHandler) {
      props.destroyHandler = this.props.destroyHandler;
    }
    return React.createElement(this.props.entityComponent, props);
  };

  renderEmpty() {
    if (!this.props.emptyListComponent) return null;
    return React.createElement(this.props.emptyListComponent);
  }

  renderList(entities) {
    return (
      <ul>
        {entities.map(entity => {
          return this.renderEntity(entity);
        })}
      </ul>
    );
  }

  render() {
    const entities = this.props.entities;
    if (!entities) return null;

    return (
      <section>
        {this.props.title ? (
          <header className="section-heading-secondary">
            <h3>
              {this.props.title} <i className={`manicon ${this.props.icon}`} />
            </h3>
          </header>
        ) : null}
        {entities.length > 0 ? this.renderList(entities) : this.renderEmpty()}
      </section>
    );
  }
}
