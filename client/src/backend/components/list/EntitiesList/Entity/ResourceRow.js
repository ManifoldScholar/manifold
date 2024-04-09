import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import EntityRow from "./Row";
import { withTranslation } from "react-i18next";
/* Importing directly rather than from form/index to prevent circular import in Picker. */
import { Toggle } from "global/components/form/Switch/ToggleOnly";

class ResourceRow extends PureComponent {
  static displayName = "EntitiesList.Entity.ResourceRow";

  static propTypes = {
    entity: PropTypes.object,
    projectId: PropTypes.string,
    showSwitch: PropTypes.bool,
    onSwitchChange: PropTypes.func,
    switchValue: PropTypes.func,
    onRowClick: PropTypes.func,
    t: PropTypes.func
  };

  get onRowClick() {
    if (this.props.onRowClick)
      return event => {
        event.preventDefault();
        event.stopPropagation();
        return this.props.onRowClick(this.resource);
      };
    return lh.link("backendResource", this.id);
  }

  get resource() {
    return this.props.entity;
  }

  get id() {
    return this.resource.id;
  }

  get kind() {
    return this.resource.attributes.kind;
  }

  get title() {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: this.resource.attributes.titleFormatted
        }}
      />
    );
  }

  get titlePlainText() {
    return this.resource.attributes.titlePlaintext;
  }

  get createdAt() {
    return this.resource.attributes.createdAt;
  }

  get showSwitch() {
    return this.props.showSwitch;
  }

  get onSwitchChange() {
    return this.props.onSwitchChange;
  }

  get switchValue() {
    return this.props.switchValue;
  }

  get utility() {
    if (!this.showSwitch) return null;

    return (
      <div className="toggle-indicator">
        <Toggle
          onClick={event => this.onSwitchChange(event, this.resource)}
          $checked={this.switchValue(this.resource)}
          role="button"
          tabIndex="0"
        >
          {this.switchValue(this.resource) ? (
            <span className="screen-reader-text">
              {this.props.t("resource_collections.remove_resource")}
            </span>
          ) : (
            <span className="screen-reader-text">
              {this.props.t("resource_collections.add_resource")}
            </span>
          )}
        </Toggle>
      </div>
    );
  }

  render() {
    return (
      <EntityRow
        {...this.props}
        onRowClick={this.onRowClick}
        rowClickMode="block"
        title={this.title}
        titlePlainText={this.titlePlainText}
        label={this.kind}
        meta={
          <FormattedDate
            prefix={this.props.t("dates.created_title_case")}
            format="PPP"
            date={this.createdAt}
          />
        }
        figure={<EntityThumbnail.Resource entity={this.resource} />}
        utility={this.utility}
      />
    );
  }
}

export default withTranslation()(ResourceRow);
