import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import CommentContainer from "global/containers/comment";
import Utility from "frontend/components/utility";
import Hero from "./Hero";
import Link from "./Link";
import Meta from "./Meta";
import Title from "./Title";
import VariantList from "./VariantList";

class ResourceDetail extends Component {
  static displayName = "Resource.Detail";

  static propTypes = {
    projectUrl: PropTypes.string,
    resourceUrl: PropTypes.string.isRequired,
    resource: PropTypes.object,
    t: PropTypes.func
  };

  createDescription(description) {
    if (!description) return { __html: this.props.t("errors.no_content") };
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
    const t = this.props.t;

    /* eslint-disable jsx-a11y/anchor-is-valid                                          */
    /* jsx-a11y sees the link in this component as missing a href attribute, but it's a */
    /* false positive, as the child Link component does in fact render an a tag with a  */
    /* href.                                                                            */
    return (
      <section className="resource-detail main-content">
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
            <div dangerouslySetInnerHTML={{ __html: attr.captionFormatted }} />

            <h2 className="attribute-header">
              {t("pages.subheaders.full_description")}
            </h2>
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
                    label={t("actions.add_comment")}
                    subject={resource}
                    cancel={event => this.cancelComment(event)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    );
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }
}

export default withTranslation()(ResourceDetail);
