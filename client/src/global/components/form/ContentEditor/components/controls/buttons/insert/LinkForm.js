import React from "react";
import { FormBaseInput as Input } from "../../../../../BaseInput";
import * as Styled from "./styles";

export default function InsertLinkForm({ urlRef, textRef, defaultValues }) {
  return (
    <Styled.Form>
      <Input
        defaultValue={defaultValues?.text}
        ref={textRef}
        name="text"
        label="Text"
      />
      <Input
        defaultValue={defaultValues?.url}
        ref={urlRef}
        name="url"
        label="url"
      />
    </Styled.Form>
  );
}
