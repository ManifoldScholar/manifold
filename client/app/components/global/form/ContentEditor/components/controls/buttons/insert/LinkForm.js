import React from "react";
import { FormBaseInput as Input } from "../../../../../BaseInput";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function InsertLinkForm({ urlRef, textRef, defaultValues }) {
  const { t } = useTranslation();

  return (
    <Styled.Form>
      <Input
        defaultValue={defaultValues?.text}
        ref={textRef}
        name="text"
        label={t("editor.forms.link_text_label")}
      />
      <Input
        defaultValue={defaultValues?.url}
        ref={urlRef}
        name="url"
        label={t("editor.forms.link_url_label")}
      />
    </Styled.Form>
  );
}
