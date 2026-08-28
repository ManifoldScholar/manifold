import { redirect } from "react-router";
import { useTranslation } from "react-i18next";
import { tokensAPI } from "api";
import getRequestCookie from "helpers/cookie/request";
import FatalError from "components/global/FatalError";
import * as Styled from "./styles";

const AUTH_CODE_COOKIE = "_oauth_auth_code";
const AUTH_TOKEN_MAX_AGE = 90 * 24 * 60 * 60;

const ENTITY_PATHS = {
  Journal: slug => `/journals/${slug}`,
  Project: slug => `/projects/${slug}`,
  ProjectCollection: slug => `/project-collections/${slug}`,
  Text: slug => `/read/${slug}`,
  TextSection: (slug, parent) => `/read/${parent}/section/${slug}`,
  Resource: (slug, parent) => `/projects/${parent}/resource/${slug}`,
  ResourceCollection: (slug, parent) =>
    `/projects/${parent}/resource-collection/${slug}`
};

function redirectPathFor(params) {
  const explicit = params.get("redirect_path");
  if (explicit) return explicit;
  const build = ENTITY_PATHS[params.get("redirect_type")];
  return build ? build(params.get("redirect_id"), params.get("parent")) : "/";
}

export const loader = async ({ request, url }) => {
  if (url.searchParams.get("error")) return { error: { status: 401 } };

  const authCode = getRequestCookie(request, AUTH_CODE_COOKIE);
  if (!authCode) return { error: { status: 401 } };

  let authToken;
  try {
    const user = await tokensAPI.createToken({ authCode });
    authToken = user?.meta?.authToken;
  } catch (e) {
    return { error: { status: e?.status ?? 500 } };
  }
  if (!authToken) return { error: { status: 500 } };

  throw redirect(redirectPathFor(url.searchParams), {
    headers: {
      "Set-Cookie": `authToken=${authToken}; Path=/; Max-Age=${AUTH_TOKEN_MAX_AGE}; SameSite=Lax`
    }
  });
};

export default function OAuthRoute({ loaderData }) {
  const { t } = useTranslation();
  const error = loaderData?.error
    ? { ...loaderData.error, heading: t("errors.oauth.heading") }
    : null;

  return (
    <Styled.Section className="bg-neutral05">
      {error ? (
        <FatalError fatalError={{ error }} contained />
      ) : (
        <Styled.Container className="container">
          <Styled.Message>{t("messages.oauth.logging_in")}</Styled.Message>
        </Styled.Container>
      )}
    </Styled.Section>
  );
}
