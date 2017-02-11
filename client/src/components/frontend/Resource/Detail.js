import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import { Utility, Resource } from 'components/frontend';

export default class ResourceDetail extends Component {

  static displayName = "Resource.Detail";

  static propTypes = {
    projectId: PropTypes.string,
    resource: PropTypes.object
  };

  render() {
    const resource = this.props.resource;
    const attr = resource.attributes;

    return (
      <div>
        <section>
          <section className="resource-detail">
            <div className="container flush-top flush-bottom">
              <Resource.Title resource={resource} showIcon={false}/>
            </div>

              <Resource.Hero resource={resource}/>

            <div className="container flush-top">
              <aside>
                <Resource.Link attributes={attr}/>
                <Link to="#" className="button-primary">
                  View in Text <i className="manicon manicon-arrow-right"></i>
                </Link>
                <Utility.ShareBar/>
                <Resource.Meta resource={resource} style={'secondary'}/>
              </aside>
              <div className="resource-content left">
                <p>
                  {attr.caption}
                </p>

                <h3 className="attribute-header">
                  Full Description
                </h3>
                <p>
                  {attr.description}
                </p>
              </div>
              <div className="resource-meta-mobile">
                <Resource.Meta resource={resource} style={'primary'}/>
              </div>
            </div>
          </section>
        </section>
      </div>
    );
  }
}
