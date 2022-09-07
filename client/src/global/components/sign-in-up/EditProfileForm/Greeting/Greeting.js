import React from "react";
import { Trans } from "react-i18next";
import { useFormContext } from "react-hook-form";
import * as Styled from "./styles";

export default function ProfileGreeting({ mode, defaultNickname }) {
  const { watch } = useFormContext();
  const nickname = watch("nickname") ?? defaultNickname;

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
