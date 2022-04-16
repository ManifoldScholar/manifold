import React, { Component } from "react";
import PropTypes from "prop-types";
import { Trans, withTranslation } from "react-i18next";
import get from "lodash/get";
import debounce from "lodash/debounce";
import lh from "helpers/linkHandler";
import isEmpty from "lodash/isEmpty";
import { Collapse } from "react-collapse";
import * as Styled from "./styles";

class ResourceListSlideCaption extends Component {
  static visibleCaptionHeight = 48;

  static propTypes = {
    resource: PropTypes.object,
    resourceCollection: PropTypes.object,
    hideDetailUrl: PropTypes.bool,
    hideDownload: PropTypes.bool,
    t: PropTypes.func
  };

  static defaultProps = {
    hideDetailUrl: false,
    hideDownload: false
  };

  constructor() {
    super();
    this.state = {
      init: true,
      expanded: false
    };
  }

  componentDidMount() {
    this.checkExpandable();
    // Check expandable on resize
    this.debouncedExpand = debounce(this.checkExpandable, 120);
    window.addEventListener("resize", this.debouncedExpand);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.debouncedExpand);
  }

  componentDidUpdate() {
    this.checkExpandable();
  }

  canDownload(resource) {
    if (this.props.hideDownload) return false;
    return get(resource, "attributes.downloadable") || false;
  }

  hasCaption(resource) {
    return !isEmpty(get(resource, "attributes.captionFormatted"));
  }

  handleReadMore = () => {
    if (!this.canExpand()) return;

    this.setState({
      expanded: !this.state.expanded
    });
  };

  createDescription(description) {
    return {
      __html: description || ""
    };
  }

  canExpand() {
    if (!this._utility) return false;
    if (!this._description) return false;
    return (
      this._description.offsetHeight >
      ResourceListSlideCaption.visibleCaptionHeight
    );
  }

  checkExpandable = () => {
    if (this.canExpand()) return true;
    return false;
  };

  detailUrl() {
    const { resource, resourceCollection } = this.props;
    if (resourceCollection) {
      return lh.link(
        "frontendProjectCollectionResource",
        resource.attributes.projectSlug,
        resourceCollection.attributes.slug,
        resource.attributes.slug
      );
    }
    return lh.link(
      "frontendProjectResource",
      resource.attributes.projectSlug,
      resource.attributes.slug
    );
  }

  renderDescription(resource) {
    if (!this.hasCaption(resource)) return null;
    const attr = resource.attributes;
    const contents = this.createDescription(attr.captionFormatted);

    return (
      <Collapse isOpened onRest={this.checkExpandable}>
        <Styled.Description
          ref={e => (this._description = e)}
          $expanded={this.state.expanded}
          dangerouslySetInnerHTML={contents}
        />
      </Collapse>
    );
  }

  render() {
    const resource = this.props.resource;
    const attr = resource.attributes;
    const detailUrl = this.detailUrl();
    const t = this.props.t;

    return (
      <Styled.Caption>
        <header>
          <Styled.Title
            dangerouslySetInnerHTML={{ __html: attr.titleFormatted }}
          />
          <span className="screen-reader-text" role="alert">
            <Trans i18nKey="messages.showing_resource">
              Showing {{ type: attr.type }} resource: {{ title: attr.title }}
            </Trans>
          </span>
        </header>
        {this.renderDescription(resource)}
        <Styled.Utility
          $expandable={this.checkExpandable()}
          ref={e => {
            this._utility = e;
          }}
        >
          <Styled.UtilityInner $expanded={this.state.expanded}>
            <Styled.MoreLink
              onClick={this.handleReadMore}
              $expandable={this.checkExpandable()}
            >
              <Styled.OpenText $expanded={this.state.expanded}>
                {t("actions.read_more")}
              </Styled.OpenText>
              <Styled.CloseText $expanded={this.state.expanded}>
                {t("actions.hide_description")}
              </Styled.CloseText>
            </Styled.MoreLink>
            {this.canDownload(resource) ? (
              <Styled.DownloadLink
                href={attr.attachmentStyles.original}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{t("actions.download")}</span>
                <Styled.DownloadIcon icon="arrowDown16" size="default" />
              </Styled.DownloadLink>
            ) : null}
            {detailUrl && !this.props.hideDetailUrl ? (
              <Styled.DetailLink to={detailUrl}>
                {t("actions.view_resource")}
              </Styled.DetailLink>
            ) : null}
          </Styled.UtilityInner>
        </Styled.Utility>
      </Styled.Caption>
    );
  }
}

export default withTranslation()(ResourceListSlideCaption);
