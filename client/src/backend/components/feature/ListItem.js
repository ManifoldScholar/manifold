import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Utility from "global/components/utility";
import FormattedDate from "global/components/formatted-date";
import lh from "helpers/linkHandler";
import truncate from "lodash/truncate";

export default class FeatureListItem extends PureComponent {
  static displayName = "Feature.ListItem";

  static propTypes = {
    entity: PropTypes.object
  };

  render() {
    const feature = this.props.entity;
    const attr = feature.attributes;
    return (
      <li key={feature.id}>
        <Link to={lh.link("backendRecordsFeature", feature.id)}>
          <header>
            <figure className="asset-image">
              <div className="asset-image-placeholder">
                <Utility.IconComposer icon="resource-document" />
              </div>
            </figure>
            <div className="meta">
              <h3 className="name large">
                {truncate(attr.header || `Untitled #${attr.position}`, {
                  length: 60
                })}
              </h3>
              <span className="subtitle">
                <FormattedDate
                  prefix="Added"
                  format="MMMM, YYYY"
                  date={attr.createdAt}
                />
              </span>
            </div>
          </header>
          {attr.live && <span className="label">published</span>}
        </Link>
      </li>
    );
  }
}
