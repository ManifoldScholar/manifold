import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";

export default class PageListItem extends PureComponent {
  static displayName = "Page.ListItem";

  static propTypes = {
    entity: PropTypes.object
  };

  render() {
    const page = this.props.entity;
    const attr = page.attributes;
    return (
      <li key={page.id}>
        <Link to={lh.link("backendRecordsPage", page.id)}>
          <div className="content">
            <figure className="asset-image">
              <div className="asset-image-placeholder">
                <Utility.IconComposer icon="resourceDocument64" />
              </div>
            </figure>
            <div className="meta">
              <h3 className="name large">{attr.title}</h3>
              <span className="subtitle">
                {attr.isExternalLink ? attr.externalLink : `/page/${attr.slug}`}
              </span>
            </div>
          </div>
          <span className="label">{attr.purpose.replace(/_/g, " ")}</span>
        </Link>
      </li>
    );
  }
}
