import React, { Component } from "react";
import * as Styled from "./styles";

export default class ResourceListLoadingCaption extends Component {
  render() {
    return (
      <Styled.Caption>
        <header>
          <Styled.Title as="p" />
        </header>
        <Styled.Description>
          <p />
        </Styled.Description>
        <Styled.Utility />
      </Styled.Caption>
    );
  }
}
