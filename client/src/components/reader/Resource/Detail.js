import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import { ResourceList } from 'components/frontend';
import { Utility, Resource } from 'components/frontend';
import Icon from 'components/frontend/Resource/Icon';

export default class ResourceOverlayDetail extends PureComponent {

  static propTypes = {
    resource: PropTypes.object,
    handleClose: PropTypes.func
  };

  render() {
    const resource = this.props.resource;
    const attr = resource.attributes;

    return (
      <div className="container">
        <div className="resource-detail">
          <div className="resource-kind">
            <figure className={`resource-icon ${attr.kind}`}>
              <Icon.Composer kind={attr.kind}/>
            </figure>
            <h3>{attr.kind}</h3>
          </div>
          <Resource.Title resource={resource} showDate={false} />
          <div className="resource-content">
            <p>
              {/*
                TODO/Bug: Description is not available in this context, but
                should likely appear here.
              */}
              {attr.caption}
            </p>
          </div>

          {/*
            <div className="resource-default">
              <ResourceList.Slide.Slide
                  resource={resource}
              />
            </div>
          */}
          <Resource.Hero resource={resource} />
          <Resource.Meta
            resource={resource}
            style={'secondary columnar'}
            showIcon={false}
            showTags={false}
          />

        <nav className="button-nav">
          <Resource.Link attributes={attr} buttonClass="button-secondary outlined" /><br/>
          <Link to="#" className="button-secondary outlined">
            Visit Resource Page<i className="manicon manicon-arrow-right"></i>
          </Link><br/>
          <button onClick={this.props.handleClose} className="button-secondary outlined dull">
            <i className="manicon manicon-arrow-left"></i>Return to Reader
          </button>
        </nav>
        </div>
      </div>
    );
  }
}
