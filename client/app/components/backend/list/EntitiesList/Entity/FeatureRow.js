import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "components/global/FormattedDate";

import truncate from "lodash/truncate";
import EntityRow from "./Row";
import EntityThumbnail from "components/global/entity-thumbnail";
import Utility from "components/global/utility";
import { withTranslation } from "react-i18next";

class FeatureRow extends PureComponent {
  static displayName = "EntitiesList.Entity.FeatureRow";

  static propTypes = {
    entity: PropTypes.object,
    onTogglePublish: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  onTogglePublish = event => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onTogglePublish(this.feature);
  };

  get feature() {
    return this.props.entity;
  }

  get id() {
    return this.feature.id;
  }

  get createdAt() {
    return this.feature.attributes.createdAt;
  }

  get live() {
    return this.feature.attributes.live;
  }

  get header() {
    return this.feature.attributes.header;
  }

  get position() {
    return this.feature.attributes.position;
  }

  get url() {
    return `/backend/records/features/${this.id}`;
  }

  get name() {
    return truncate(
      this.header ||
        this.props.t("records.features.untitled_record", {
          number: this.position
        }),
      {
        length: 60
      }
    );
  }

  get label() {
    if (this.live) return this.props.t("dates.published");
    return null;
  }

  get utility() {
    if (this.live)
      return (
        <button
          className="entity-row__utility-button"
          onClick={this.onTogglePublish}
          title={this.props.t("records.features.unpublish")}
        >
          <Utility.IconComposer icon="eyeClosed32" size={26} />
        </button>
      );

    return (
      <button
        className="entity-row__utility-button"
        onClick={this.onTogglePublish}
        title={this.props.t("records.features.publish")}
      >
        <Utility.IconComposer icon="eyeOpen32" size={26} />
      </button>
    );
  }

  render() {
    return (
      <EntityRow
        {...this.props}
        onRowClick={this.url}
        rowClickMode="inline"
        title={this.name}
        meta={
          <FormattedDate
            prefix={this.props.t("dates.added_title_case")}
            format="MMMM, yyyy"
            date={this.createdAt}
          />
        }
        label={this.label}
        figure={<EntityThumbnail.Feature entity={this.feature} />}
        utility={this.utility}
      />
    );
  }
}

export default withTranslation()(FeatureRow);
