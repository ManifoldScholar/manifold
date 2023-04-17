import React from "react";
import { FormBaseInput as Input } from "../../../../../BaseInput";
import * as Styled from "./styles";

export default function InsertLinkForm({ urlRef }) {
  return (
    <Styled.Form>
      <Input ref={urlRef} name="url" label="url" />
    </Styled.Form>
  );
}
