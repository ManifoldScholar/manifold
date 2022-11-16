import React, { useContext } from "react";
import { Trans } from "react-i18next";
import PropTypes from "prop-types";
import { FormContext } from "helpers/contexts";
import * as Styled from "./styles";

export default function ProfileGreeting({ mode }) {
  const formData = useContext(FormContext);
  const nickname = formData.getModelValue("attributes[nickname]");

  return mode === "new" ? (
    <Trans
      i18nKey="forms.signin_overlay.create_success_message"
      components={[
        <Styled.Heading />,
        <Styled.Text />,
        <Styled.Nickname as="h4" />
      ]}
      values={{ name: nickname }}
    />
  ) : (
    <Styled.Heading>
      <Trans
        i18nKey="forms.signin_overlay.greeting"
        components={[<Styled.Nickname />]}
        values={{ name: nickname }}
      />
    </Styled.Heading>
  );
}

ProfileGreeting.displayName = "Global.SignInUp.EditProfileForm.Greeting";

ProfileGreeting.propTypes = {
  mode: PropTypes.oneOf(["new", "existing"]),
  nickname: PropTypes.string
};
