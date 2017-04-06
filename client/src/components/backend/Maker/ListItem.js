import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import { linkHelpers as lh } from 'routes';

export default class MakerListItem extends PureComponent {

  static displayName = "Maker.ListItem";

  static propTypes = {
    entity: PropTypes.object
  };

  render() {
    const maker = this.props.entity;
    const attr = maker.attributes;
    const rowClasses = classnames({ active: this.props.active === maker.id });
    return (
      <li key={maker.id} className={rowClasses} >
        {/* Add .checked to .checkbox-primary to display checked state */}
        <div className="checkbox-primary">
          <div className="toggle-indicator">
            <i className="manicon manicon-check"></i>
          </div>
        </div>
        <Link to={lh.backendPeopleMaker(maker.id)}>
          <header>
            <figure className="avatar">
              {attr.avatarStyles.smallSquare ?
                <div
                  className="image"
                  style={ { backgroundImage: `url(${attr.avatarStyles.smallSquare})` } }
                />
                :
                <div className="no-image">
                  <i className="manicon manicon-person"></i>
                </div>
              }
            </figure>
            <div className="meta">
              <h3 className="name large">
                {attr.firstName} {attr.lastName}
              </h3>
            </div>
          </header>
          <span className="label">
          </span>
        </Link>
      </li>
    );
  }

}
