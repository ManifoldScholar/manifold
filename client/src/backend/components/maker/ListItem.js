import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classnames from "classnames";
import lh from "helpers/linkHandler";

export default class MakerListItem extends PureComponent {
  static displayName = "Maker.ListItem";

  static propTypes = {
    entity: PropTypes.object,
    active: PropTypes.string
  };

  render() {
    const maker = this.props.entity;
    const attr = maker.attributes;
    const rowClasses = classnames({ active: this.props.active === maker.id });
    return (
      <li key={maker.id} className={rowClasses}>
        <Link to={lh.link("backendRecordsMaker", maker.id)}>
          <div className="content">
            <figure className="avatar">
              <figcaption className="screen-reader-text">
                Maker Avatar
              </figcaption>
              {attr.avatarStyles.smallSquare ? (
                <div
                  className="image"
                  style={{
                    backgroundImage: `url(${attr.avatarStyles.smallSquare})`
                  }}
                />
              ) : (
                <div className="no-image">
                  <i className="manicon manicon-person" aria-label="hidden" />
                </div>
              )}
            </figure>
            <div className="meta">
              <span className="name large">{attr.fullName}</span>
            </div>
          </div>
          <span className="label" />
        </Link>
      </li>
    );
  }
}
