import OAuthMonitor from "../OAuthMonitor";
import { useSettings } from "hooks";
import OAuthProviderButton from "../OAuthProviderButton";
import * as Styled from "./styles";

export default function OAuthLoginOptions() {
  const settings = useSettings();

  const customOAuthProviders = settings?.attributes?.oauth?.length
    ? settings.attributes.oauth.filter(provider => provider.custom)
    : [];

  return (
    <Styled.Wrapper>
      <OAuthMonitor />
      <OAuthProviderButton provider="google" icon="socialEmail32" />
      {customOAuthProviders.map(provider => (
        <OAuthProviderButton key={provider.name} provider={provider.name} />
      ))}
    </Styled.Wrapper>
  );
}

OAuthLoginOptions.displayName = "Global.SignInUp.OAuthOptions";
