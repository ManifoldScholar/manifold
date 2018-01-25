import React, { Component } from "react";
import PropTypes from "prop-types";
import FormattedDate from "components/global/FormattedDate";
import { Resource } from "components/frontend";
import get from "lodash/get";
import classnames from "classnames";

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
        {this.props.enableZoom
          ? <Resource.Preview resource={this.props.resource}>
              <div className="zoom-indicator">
                {this.props.zoomLabel}
                <i className="manicon manicon-magnify-plus" />
              </div>
            </Resource.Preview>
          : null}
        <div
          ref={c => {
            this._figure = c;
          }}
          className="figure-default"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className={infoClassNames}>
            <i className={`manicon manicon-resource-${attr.kind}`} />
            <span className="resource-type">
              {attr.kind}
            </span>
            <span className="resource-date">
              <FormattedDate
                prefix="Added"
                format="MMMM, YYYY"
                date={attr.createdAt}
              />
            </span>
          </div>
        </div>
      </figure>
    );
  }
}
