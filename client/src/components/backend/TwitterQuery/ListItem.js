import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import classnames from "classnames";

export default class TwitterQueryListItem extends PureComponent {
  static displayName = "TwitterQuery.ListItem";

  static propTypes = {
    entity: PropTypes.object,
    active: PropTypes.string
  };

  render() {
    const query = this.props.entity;
    if (!query) return null;
    const project = query.relationships.project;
    const labelClasses = classnames({
      label: true,
      secondary: !query.attributes.active
    });
    const itemClasses = classnames({
      active: this.props.active === query.id
    });
    const labelText = query.attributes.active ? "Active" : "Inactive";

    return (
      <li key={query.id} className={itemClasses}>
        <Link
          to={lh.link("backendProjectSocialTwitterQuery", project.id, query.id)}
        >
          <header>
            <figure>
              <i className="manicon manicon-twitter" />
            </figure>
            <h3 className="name large">{query.attributes.query}</h3>
          </header>
          <span className={labelClasses}>
            <span className="specifier dull">
              {query.attributes.eventsCount} EVENTS{" "}
            </span>
            {labelText}
          </span>
        </Link>
      </li>
    );
  }
}
