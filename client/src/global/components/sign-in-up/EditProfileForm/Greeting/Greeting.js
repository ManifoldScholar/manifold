import React from "react";
import { Trans } from "react-i18next";

export default function ProfileGreeting({ mode, nickname }) {
  return mode === "new" ? (
    <Trans
      i18nKey="forms.signin_overlay.create_success_message"
      components={[
        <h4 className="form-heading" />,
        <p className="overlay-copy" />,
        <h4 className="nickname" />
      ]}
      values={{ name: nickname }}
    />
  ) : (
    <h4 className="form-heading">
      <Trans
        i18nKey="forms.signin_overlay.greeting"
        components={[<span className="nickname" />]}
        values={{ name: nickname }}
      />
    </h4>
  );
}
