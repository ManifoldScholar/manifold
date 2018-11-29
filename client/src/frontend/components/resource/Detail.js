import React, { Component } from "react";
import PropTypes from "prop-types";
import CommentContainer from "global/containers/comment";
import Utility from "frontend/components/utility";
import Hero from "./Hero";
import Link from "./Link";
import Meta from "./Meta";
import Title from "./Title";
import VariantList from "./VariantList";

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
              <Title resource={resource} showIcon={false} />
            </div>

            <Hero resource={resource} />

            <div className="container flush-top">
              <aside>
                <Link attributes={attr} />
                {/*
                <Link to="#" className="button-primary">
                  View in Text <i className="manicon manicon-arrow-right" aria-hidden="true" ></i>
                </Link>
                */}
                <Utility.ShareBar url={resourceUrl} />
                <Meta resource={resource} layout={"secondary"} />
                <VariantList resource={resource} />
              </aside>
              <div className="resource-meta-mobile">
                <Meta resource={resource} layout={"secondary"} />
              </div>
              <div className="resource-variants-mobile">
                <VariantList resource={resource} />
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
                    focus={false}
                    label={"Add Comment"}
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
