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
        {this.props.projectId ?
          <Utility.BackLinkPrimary
            link={`/browse/project/${this.props.projectId}`}
          /> : null
        }
        <section>
          <div className="container flush-top">
            <Resource.Hero resource={resource} />

            <section className="resource-detail">
              <aside>
                <Link to="{attr.}" className="button-primary">
                  Download <i className="manicon manicon-arrow-down"></i>
                </Link>
                <Link to="#" className="button-primary">
                  View in Text <i className="manicon manicon-arrow-right"></i>
                </Link>
                <Utility.ShareBar/>
                <Resource.Meta resource={resource} style={'secondary'}/>
              </aside>
              <div className="resource-content">
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
            </section>
          </div>
        </section>

        {this.props.projectId ?
          <section className="bg-neutral05">
            <Utility.BackLinkSecondary
              link={`/browse/project/${this.props.projectId}`}
            />
          </section> : null
        }
      </div>
    );
  }
}
