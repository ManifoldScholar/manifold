import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import { Utility, Resource } from 'components/frontend';

export default class ResourceDetail extends Component {

  static displayName = "Resource.Detail";

  static propTypes = {
    projectId: PropTypes.string,
    projectUrl: PropTypes.string,
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
                {/*
                <Link to="#" className="button-primary">
                  View in Text <i className="manicon manicon-arrow-right"></i>
                </Link>
                */}
                {/*
                  Todo: shareBar should be passed a url string that
                  contains the current url, composed of the projcet and
                  resource url.
                */}
                {/* remove these break tags when the share bare is restored */}
                <br /><br />
                {/* <Utility.ShareBar url={url}/> */}
                <Resource.Meta
                  resource={resource}
                  style={'secondary'}
                  projectUrl={this.props.projectUrl}
                />
              </aside>
              <div className="resource-content left">
                <p>
                  {attr.caption}
                </p>

                <h3 className="attribute-header">
                  Full Description
                </h3>
                <p>
                  {attr.descriptionFormatted ?
                    attr.descriptionFormatted
                  : "No description provided."}
                </p>
              </div>
              <div className="resource-meta-mobile">
                <Resource.Meta
                  resource={resource}
                  style={'primary'}
                  projectUrl={this.props.projectUrl}
                />
              </div>
            </div>
          </section>
        </section>
      </div>
    );
  }
}
