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
        {/* Add .checked to .checkbox-primary to display checked state.
         Disabled until functionality is implemented. */}
        {/* <div className="checkbox-primary">
         <div className="toggle-indicator" aria-hidden="true">
         <i className="manicon manicon-check" />
         </div>
         </div> */}
        <Link to={lh.link("backendRecordsMaker", maker.id)}>
          <header>
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
              <h3 className="name large">{attr.fullName}</h3>
            </div>
          </header>
          <span className="label" />
        </Link>
      </li>
    );
  }
}
