import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Resource from "frontend/components/resource";
import IconComputed from "global/components/icon-computed";
import lh from "helpers/linkHandler";
import isEmpty from "lodash/isEmpty";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";

export default class ResourceDetail extends PureComponent {
  static propTypes = {
    resource: PropTypes.object,
    handleClose: PropTypes.func
  };

  componentDidMount() {
    window.addEventListener("keyup", this.handleEscape);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleEscape);
  }

  handleEscape = event => {
    if (event.keyCode === 27) {
      this.props.handleClose(event);
    }
  };

  buildRedirectUrl(resource) {
    if (!resource) return null;
    return lh.link(
      "frontendProjectResource",
      resource.attributes.projectSlug,
      resource.attributes.slug
    );
  }

  render() {
    const resource = this.props.resource;
    const attr = resource.attributes;
    const resourceUrl = this.buildRedirectUrl(resource);

    return (
      <div className="resource-detail">
        <div className="container">
          <div className="resource-kind">
            <figure className={`resource-icon ${attr.kind}`}>
              <IconComputed.Resource icon={attr.kind} size={50} />
            </figure>
          </div>
          <Resource.Title resource={resource} />
          <div className="resource-content">
            {!isEmpty(attr.captionFormatted) ? (
              <div
                dangerouslySetInnerHTML={{ __html: attr.captionFormatted }}
              />
            ) : null}
            {!isEmpty(attr.descriptionFormatted) ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: attr.descriptionFormatted
                }}
              />
            ) : null}
          </div>
        </div>
        <Resource.Hero
          resource={resource}
          slideOptions={{ enableZoom: false }}
        />
        <div className="container">
          <Resource.Meta
            resource={resource}
            layout={"secondary columnar"}
            showIcon={false}
            showTags={false}
          />

          <nav className="button-nav button-nav--stack">
            <Resource.Link
              attributes={attr}
              buttonClass="button-secondary button-secondary--outlined"
            />
            <br />
            <Link
              to={resourceUrl}
              className="button-secondary button-secondary--outlined"
            >
              <span className="button-secondary__text">
                Visit Resource Page
              </span>
              <IconComposer
                icon="arrowRight16"
                size="default"
                iconClass="button-secondary__icon"
              />
            </Link>
            <br />
            <button
              onClick={this.props.handleClose}
              className={classNames(
                "button-secondary",
                "button-secondary--outlined",
                "button-secondary--dull"
              )}
              data-id="close-overlay"
            >
              <IconComposer
                icon="arrowLeft16"
                size="default"
                iconClass="button-secondary__icon"
              />
              <span className="button-secondary__text">Return to Reader</span>
            </button>
          </nav>
        </div>
      </div>
    );
  }
}
