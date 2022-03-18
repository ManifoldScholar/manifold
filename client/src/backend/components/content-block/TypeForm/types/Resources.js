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
          label={this.props.t("backend.forms.title")}
          name="attributes[title]"
          instructions={this.props.t(
            "backend.forms.resource.default_title_message"
          )}
          focusOnMount
        />
        <Form.TextArea
          label={this.props.t("backend.forms.description")}
          name="attributes[description]"
        />
        <Form.Switch
          label={this.props.t("backend.forms.resource.collections_switch")}
          instructions={this.props.t(
            "backend.forms.resource.collections_switch_info"
          )}
          name="attributes[showAllCollections]"
          wide
        />
        {!this.showAllCollections ? (
          <>
            <Form.Picker
              placeholder={this.props.t(
                "backend.forms.resource.select_collection_placeholder"
              )}
              label={this.props.t("backend.forms.resource.select_collection")}
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
