import React from "react";
import { FormBaseInput as Input } from "../../../../../BaseInput";
import * as Styled from "./styles";

export default function InsertIframeForm({ urlRef, titleRef, defaultValues }) {
  return (
    <Styled.Form>
      <Input
        defaultValue={defaultValues?.src}
        ref={urlRef}
        name="url"
        label="url"
      />
      <Input
        defaultValue={defaultValues?.title}
        ref={titleRef}
        name="title"
        label="title"
      />
    </Styled.Form>
  );
}
