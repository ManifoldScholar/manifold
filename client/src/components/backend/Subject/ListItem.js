import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classnames from "classnames";
import lh from "helpers/linkHandler";

export default class SubjectListItem extends PureComponent {
  static displayName = "Subject.ListItem";

  static propTypes = {
    entity: PropTypes.object,
    active: PropTypes.string
  };

  render() {
    const subject = this.props.entity;
    const attr = subject.attributes;
    const rowClasses = classnames({ active: this.props.active === subject.id });
    return (
      <li key={subject.id} className={rowClasses}>
        <Link to={lh.link("backendSettingsSubject", subject.id)}>
          <header>
            <div className="meta">
              <h3 className="name large">
                {attr.name}
              </h3>
            </div>
          </header>
        </Link>
      </li>
    );
  }
}
