import React from "react";
import { FormBaseInput as Input } from "../../../../../BaseInput";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function InsertIframeForm({ urlRef, titleRef, defaultValues }) {
  const { t } = useTranslation();

  return (
    <Styled.Form>
      <Input
        defaultValue={defaultValues?.src}
        ref={urlRef}
        name="url"
        label={t("editor.forms.iframe_url_label")}
      />
      <Input
        defaultValue={defaultValues?.title}
        ref={titleRef}
        name="title"
        label={t("editor.forms.title_label")}
      />
    </Styled.Form>
  );
}
