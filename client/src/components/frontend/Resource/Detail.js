import React, { Component } from "react";
import PropTypes from "prop-types";
import { Comment as CommentContainer } from "containers/global";
import { Utility, Resource } from "components/frontend";

export default class ResourceDetail extends Component {
  static displayName = "Resource.Detail";

  static propTypes = {
    projectUrl: PropTypes.string,
    resourceUrl: PropTypes.string.isRequired,
    resource: PropTypes.object
  };

  createDescription(description) {
    if (!description) return { __html: "No content provided." };
    return {
      __html: description
    };
  }

  // The cancel prop is required by CommentEditor.
  // We don't render the cancel button in this context,
  // so this is basically a stub. --MO
  cancelComment(event) {
    if (!event) return null;
    event.preventDefault();
  }

  render() {
    const { resource, resourceUrl } = this.props;
    if (!resource) return null;
    const attr = resource.attributes;

    return (
      <div>
        <section>
          <section className="resource-detail">
            <div className="container flush-top flush-bottom">
              <Resource.Title resource={resource} showIcon={false} />
            </div>

            <Resource.Hero resource={resource} />

            <div className="container flush-top">
              <aside>
                <Resource.Link attributes={attr} />
                {/*
                <Link to="#" className="button-primary">
                  View in Text <i className="manicon manicon-arrow-right"></i>
                </Link>
                */}
                <Utility.ShareBar url={resourceUrl} />
                <Resource.Meta resource={resource} layout={"secondary"} />
              </aside>
              <div className="resource-meta-mobile">
                <Resource.Meta resource={resource} layout={"secondary"} />
              </div>
              <div className="resource-content left">
                <div
                  dangerouslySetInnerHTML={{ __html: attr.captionFormatted }}
                />

                <h3 className="attribute-header">Full Description</h3>
                <div
                  dangerouslySetInnerHTML={this.createDescription(
                    attr.descriptionFormatted
                  )}
                />
                <div className="resource-comments">
                  <CommentContainer.Thread subject={resource} />
                  <CommentContainer.Editor
                    subject={resource}
                    cancel={event => this.cancelComment(event)}
                  />
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    );
  }
}
