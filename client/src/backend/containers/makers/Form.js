import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { makersAPI, requests } from "api";

class MakersFormContainer extends PureComponent {
  static displayName = "Makers.Form";

  static propTypes = {
    maker: PropTypes.object,
    successHandler: PropTypes.func,
    options: PropTypes.object,
    t: PropTypes.func
  };

  handleSuccess = maker => {
    if (!this.props.successHandler) return null;
    return this.props.successHandler(maker);
  };

  render() {
    const { maker, t } = this.props;
    const requestName = maker ? requests.beMakerUpdate : requests.beMakerCreate;

    return (
      <section>
        <FormContainer.Form
          model={maker}
          modelName="Maker"
          name={requestName}
          update={makersAPI.update}
          create={makersAPI.create}
          onSuccess={this.handleSuccess}
          options={this.props.options}
          className="form-secondary"
          notificationScope="drawer"
        >
          <Form.TextInput
            label={t("records.makers.title")}
            name="attributes[prefix]"
            placeholder={t("records.makers.title")}
            focusOnMount
            wide
          />
          <Form.TextInput
            label={t("records.makers.first_name")}
            name="attributes[firstName]"
            placeholder={t("records.makers.first_name")}
            wide
          />
          <Form.TextInput
            label={t("records.makers.middle_name")}
            name="attributes[middleName]"
            placeholder={t("records.makers.middle_name")}
            wide
          />
          <Form.TextInput
            label={t("records.makers.last_name")}
            name="attributes[lastName]"
            placeholder={t("records.makers.last_name")}
            wide
          />
          <Form.TextInput
            label={t("records.makers.suffix")}
            name="attributes[suffix]"
            placeholder={t("records.makers.suffix")}
            wide
          />
          <Form.Upload
            layout="square"
            accepts="images"
            label={t("records.makers.avatar")}
            readFrom="attributes[avatarStyles][small]"
            name="attributes[avatar]"
            remove="attributes[removeAvatar]"
            wide
          />
          <Form.Save text={t("records.makers.submit_label")} />
        </FormContainer.Form>
      </section>
    );
  }
}

export default withTranslation()(MakersFormContainer);
