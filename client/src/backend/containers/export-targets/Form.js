import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { exportTargetsAPI, requests } from "api";
import { camelCase } from "lodash";
import Form from "global/components/form";
import FormContainer from "global/containers/form";

class ExportTargetsContainerForm extends PureComponent {
  static displayName = "ExportTargets.Form";

  static propTypes = {
    model: PropTypes.object,
    onSuccess: PropTypes.func, // eslint-disable-line react/require-default-props
    options: PropTypes.object,
    t: PropTypes.func
  };

  static defaultProps = {
    model: {},
    options: {}
  };

  get modelExists() {
    return !!this.props.model.id;
  }

  get formKind() {
    if (this.modelExists) return requests.beExportTargetUpdate;
    return requests.beExportTargetCreate;
  }

  renderFormContents(getModelValue) {
    const strategy = camelCase(getModelValue("attributes[strategy]"));
    const t = this.props.t;
    return (
      <>
        <Form.Errors names={["attributes[configuration]"]} />
        <Form.TextInput
          focusOnMount
          label={t("backend.forms.export_target.name_label")}
          name="attributes[name]"
          placeholder={t("backend.forms.export_target.name_placeholder")}
          wide
        />
        <Form.TextInput
          label={t("backend.forms.export_target.format_label")}
          name="attributes[configuration][targetNameFormat]"
          placeholder="%s.%e"
          wide
        />
        <Form.Select
          label={t("backend.forms.export_target.type_label")}
          name="attributes[strategy]"
          options={[
            {
              label: t("backend.forms.export_target.type_options.sftp_key"),
              value: "sftp_key"
            },
            {
              label: t(
                "backend.forms.export_target.type_options.sftp_password"
              ),
              value: "sftp_password"
            }
          ]}
        />
        <Form.TextInput
          label={t("backend.forms.export_target.host_label")}
          name={`attributes[configuration][${strategy}][host]`}
          placeholder={t("backend.forms.export_target.host_placeholder")}
          wide
        />
        <Form.TextInput
          label={t("backend.forms.export_target.port_label")}
          name={`attributes[configuration][${strategy}][port]`}
          placeholder="22"
          wide
        />
        <Form.TextInput
          label={t("backend.forms.export_target.username_label")}
          name={`attributes[configuration][${strategy}][username]`}
          placeholder={t("backend.forms.export_target.username_placeholder")}
          show_uncategorized_texts
          wide
        />
        {strategy === "sftpKey" && (
          <Form.TextArea
            label={t("backend.forms.export_target.private_key_label")}
            name={`attributes[configuration][${strategy}][privateKey]`}
            wide
          />
        )}
        {strategy === "sftpPassword" && (
          <Form.TextInput
            password
            label={t("backend.forms.export_target.password_label")}
            name={`attributes[configuration][${strategy}][password]`}
            wide
          />
        )}
        <Form.Save text={t("backend.forms.export_target.submit_label")} />
      </>
    );
  }

  render() {
    const { model, onSuccess, options } = this.props;
    return (
      <FormContainer.Form
        model={model}
        onSuccess={onSuccess}
        options={options}
        name={this.formKind}
        update={exportTargetsAPI.update}
        create={exportTargetsAPI.create}
        className="form-secondary"
        notificationScope="drawer"
      >
        {getModelValue => this.renderFormContents(getModelValue)}
      </FormContainer.Form>
    );
  }
}

export default withTranslation()(ExportTargetsContainerForm);
