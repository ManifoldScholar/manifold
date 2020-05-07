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

  get canEngagePublicly() {
    const { resource } = this.props;
    if (!resource) return false;
    return resource.attributes.abilities.engagePublicly;
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

    /* eslint-disable jsx-a11y/anchor-is-valid                                          */
    /* jsx-a11y sees the link in this component as missing a href attribute, but it's a */
    /* false positive, as the child Link component does in fact render an a tag with a  */
    /* href.                                                                            */
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

                <h2 className="attribute-header">Full Description</h2>
                <div
                  dangerouslySetInnerHTML={this.createDescription(
                    attr.descriptionFormatted
                  )}
                />
                <div className="resource-comments">
                  {this.canEngagePublicly && (
                    <>
                      <CommentContainer.Thread subject={resource} />
                      <CommentContainer.Editor
                        focus={false}
                        label={"Add Comment"}
                        subject={resource}
                        cancel={event => this.cancelComment(event)}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    );
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }
}
