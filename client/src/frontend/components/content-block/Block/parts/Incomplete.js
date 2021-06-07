import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";
import has from "lodash/has";
import { Translation } from "react-i18next";

export default class ContentBlockIncomplete extends PureComponent {
  static displayName = "ContentBlock.Incomplete";

  static propTypes = {
    block: PropTypes.object
  };

  get block() {
    return this.props.block;
  }

  get projectId() {
    return this.block.relationships.project.id;
  }

  get blockErrors() {
    return this.block.attributes.incompleteRenderAttributes;
  }

  get presentBlockErrors() {
    const errors = this.blockErrors
      .map(key => {
        const error = this.lookupError(key);
        if (!error) return null;
        return <span key={key}>{error}</span>;
      })
      .filter(Boolean);
    if (errors.length > 0) return errors;
    return this.defaultError;
  }

  get defaultError() {
    return (
      <Translation>
        {t => (
          <span key="default-error">
            <Link to={this.blockEditLink}>{t(`fix-this-content-block`)}</Link>
          </span>
        )}
      </Translation>
    );
  }

  get blockType() {
    return this.block.attributes.type;
  }

  get blockEditLink() {
    return lh.link("backendProjectContentBlock", this.projectId, this.block.id);
  }

  get availableErrors() {
    return {
      "Content::TableOfContentsBlock": {
        // ALERT LEONOR: Check on how translation handles the spaces in all these blocks; originally blocks used {" "} between strings and Links
        text: (
          <Translation i18nKey="specify-text-to-fix-block">
            Specify a text to
            <Link to={this.blockEditLink}>fix this block</Link>.
          </Translation>
        )
      },
      "Content::RecentActivityBlock": {
        has_activity: (
          <Translation i18nKey="no-activity-has-been-recorded">
            No activity has been recorded for this project. This warning will
            disappear once there is project activity.
          </Translation>
        )
      },
      "Content::MarkdownBlock": {
        body: (
          <Translation i18nKey="add-markdown-content-to-fix-this-block">
            Add Markdown content to
            <Link to={this.blockEditLink}>fix this block</Link>.
          </Translation>
        )
      },
      "Content::TextsBlock": {
        texts: (
          <Translation i18nKey="add-texts-to-block-or-adjust-block-config">
            <Link to={this.projectEditLink("backendProjectTexts")}>
              Add texts to the project
            </Link>
            or
            <Link to={this.blockEditLink}>adjust the block configuration</Link>
            to fix this block.
          </Translation>
        )
      },
      "Content::ResourcesBlock": {
        resources_or_collections: (
          <Translation i18nKey="add-resources-or-resource-collections">
            Add{" "}
            <Link to={this.projectEditLink("backendProjectResources")}>
              resources
            </Link>{" "}
            or{" "}
            <Link
              to={this.projectEditLink("backendProjectResourceCollections")}
            >
              resource collections
            </Link>{" "}
            to the project to fix this block.
          </Translation>
        )
      },
      "Content::MetadataBlock": {
        has_metadata: (
          <Translation i18nKey="add-project-metadata">
            <Link to={this.projectEditLink("backendProjectMetadata")}>
              Add project metadata
            </Link>{" "}
            to fix this block.
          </Translation>
        )
      }
    };
  }

  projectEditLink(type) {
    return lh.link(type, this.projectId, this.block.id);
  }

  lookupError(key) {
    if (!has(this.availableErrors, [this.blockType, key])) return null;
    return this.availableErrors[this.blockType][key];
  }

  render() {
    return (
      <Translation>
        {t => (
          <div className="entity-section-wrapper__body entity-section-wrapper__body--incomplete">
            <Utility.IconComposer icon="warningSign64" size={50} />
            <div>
              <span className="entity-section-wrapper__body--incomplete-header">
                {t(`this-content-block-needs-your-attention`)}
              </span>
              <span className="entity-section-wrapper__link-container">
                {this.presentBlockErrors}
                <span className="entity-section-wrapper__body--warning">
                  {t(`note-this-message-is-only-visible-to-editors`)}
                </span>
              </span>
            </div>
          </div>
        )}
      </Translation>
    );
  }
}
