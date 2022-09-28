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
            label={t("backend.forms.maker.title")}
            name="attributes[prefix]"
            placeholder={t("backend.forms.maker.title")}
            focusOnMount
            wide
          />
          <Form.TextInput
            label={t("backend.forms.maker.first_name")}
            name="attributes[firstName]"
            placeholder={t("backend.forms.maker.first_name")}
            wide
          />
          <Form.TextInput
            label={t("backend.forms.maker.middle_name")}
            name="attributes[middleName]"
            placeholder={t("backend.forms.maker.middle_name")}
            wide
          />
          <Form.TextInput
            label={t("backend.forms.maker.last_name")}
            name="attributes[lastName]"
            placeholder={t("backend.forms.maker.last_name")}
            wide
          />
          <Form.TextInput
            label={t("backend.forms.maker.suffix")}
            name="attributes[suffix]"
            placeholder={t("backend.forms.maker.suffix")}
            wide
          />
          <Form.Upload
            layout="square"
            accepts="images"
            label={t("backend.forms.maker.avatar")}
            readFrom="attributes[avatarStyles][small]"
            name="attributes[avatar]"
            remove="attributes[removeAvatar]"
            wide
          />
          <Form.Save text={t("backend.forms.maker.submit_label")} />
        </FormContainer.Form>
      </section>
    );
  }
}

export default withTranslation()(MakersFormContainer);
