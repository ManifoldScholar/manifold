import React from "react";
import OAuthMonitor from "../OAuthMonitor";
import { useFromStore } from "hooks";
import { useDispatch } from "react-redux";
import OAuthProviderButton from "../OAuthProviderButton";
import * as Styled from "./styles";

export default function OAuthLoginOptions() {
  const dispatch = useDispatch();
  const settings = useFromStore("settings", "select");

  const customOAuthProviders = settings?.attributes?.oauth?.length
    ? settings.attributes.oauth.filter(provider => provider.custom)
    : [];

  return (
    <Styled.Wrapper>
      <OAuthMonitor dispatch={dispatch} />
      <OAuthProviderButton provider="facebook" icon="socialFacebook32" />
      <OAuthProviderButton provider="google" icon="socialEmail32" />
      <OAuthProviderButton provider="twitter" icon="socialTwitter32" />
      {customOAuthProviders.map(provider => (
        <OAuthProviderButton key={provider.name} provider={provider.name} />
      ))}
    </Styled.Wrapper>
  );
}
