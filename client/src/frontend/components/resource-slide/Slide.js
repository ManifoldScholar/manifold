import React, { Component } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import ResourcePreview from "frontend/components/resource-preview";
import get from "lodash/get";
import classnames from "classnames";
import IconComputed from "global/components/icon-computed";
import IconComposer from "global/components/utility/IconComposer";

export default class ResourceListSlideFigure extends Component {
  static propTypes = {
    resource: PropTypes.object,
    enableZoom: PropTypes.bool,
    zoomLabel: PropTypes.string
  };

  static defaultProps = {
    enableZoom: false,
    zoomLabel: "Zoom"
  };

  render() {
    const resource = this.props.resource;
    const attr = resource.attributes;
    const poster = get(attr, "variantPosterStyles.mediumLandscape");
    let bgImage;
    if (poster) {
      bgImage = poster;
    } else {
      bgImage = "/static/images/resource-splash.png";
    }
    const infoClassNames = classnames({
      "resource-info": true,
      "with-background": !!poster
    });

    return (
      <figure>
        {this.props.enableZoom ? (
          <ResourcePreview resource={this.props.resource}>
            <div className="zoom-indicator">
              <span className="zoom-indicator__text">
                {this.props.zoomLabel}
              </span>
              <IconComposer
                icon="zoomIn16"
                size={21.333}
                iconClass="zoom-indicator__icon"
              />
            </div>
          </ResourcePreview>
        ) : null}
        <div
          className="figure-default"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className={infoClassNames}>
            <IconComputed.Resource
              size={120}
              icon={attr.kind}
              iconClass="resource-slide-figure__resource-icon"
            />
            <span className="resource-type">{attr.kind}</span>
            <span className="resource-date">
              <FormattedDate
                prefix="Added"
                format="MMMM, yyyy"
                date={attr.createdAt}
              />
            </span>
          </div>
        </div>
      </figure>
    );
  }
}
