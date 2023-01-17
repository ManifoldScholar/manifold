import React, { PureComponent } from "react";
import Form from "global/components/form";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

class ProjectContentTypeFormResources extends PureComponent {
  static displayName = "Project.Content.TypeForm.Types.Resources";

  static propTypes = {
    project: PropTypes.object.isRequired,
    getModelValue: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  get showAllCollections() {
    return this.props.getModelValue("attributes[showAllCollections]");
  }

  get collections() {
    return this.props.project.relationships.resourceCollections;
  }

  render() {
    return (
      <>
        <Form.TextInput
          label={this.props.t("common.title")}
          name="attributes[title]"
          instructions={this.props.t(
            "content_blocks.resources.default_title_message"
          )}
          focusOnMount
          wide
        />
        <Form.TextArea
          label={this.props.t("common.description")}
          name="attributes[description]"
          wide
        />
        <Form.Switch
          label={this.props.t("content_blocks.resources.collections_switch")}
          instructions={this.props.t(
            "content_blocks.resources.collections_switch_info"
          )}
          name="attributes[showAllCollections]"
          wide
          isPrimary
        />
        {!this.showAllCollections ? (
          <>
            <Form.Picker
              placeholder={this.props.t(
                "content_blocks.resources.select_collection_placeholder"
              )}
              label={this.props.t("content_blocks.resources.select_collection")}
              optionToLabel={rc => rc.attributes.title}
              name="relationships[featuredCollections]"
              options={this.collections}
              listStyle="rows"
              showAddRemoveAll
              reorderable
              listRowComponent="FormOptionRow"
            />
          </>
        ) : null}
      </>
    );
  }
}

export default withTranslation()(ProjectContentTypeFormResources);
