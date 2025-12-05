import { useEffect, useState } from "react";
import { useLocation, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  handleAuthenticationSuccess,
  handleAuthenticationFailure
} from "store/middleware/currentUserMiddleware";
import { tokensAPI } from "api";
import lh from "helpers/linkHandler";
import FatalError from "global/components/FatalError";
import BrowserCookieHelper from "helpers/cookie/Browser";
import * as Styled from "./styles";

export default function OAuth() {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [error, setError] = useState(null);

  const params = new URLSearchParams(search);
  const errorParam = params.get("error");

  useEffect(() => {
    if (errorParam)
      setError({ status: 401, heading: "Unable to Authenticate" });
  }, [errorParam]);

  const cookieHelper = new BrowserCookieHelper();
  const authCode = cookieHelper.read("authCode");

  const entityType = params.get("redirect_type");
  const entitySlug = params.get("redirect_id");
  const redirectPath =
    entityType === "journal"
      ? lh.link("frontendJournal", entitySlug)
      : lh.link("frontendProject", entitySlug);

  useEffect(() => {
    const loginUser = async () => {
      try {
        const user = await tokensAPI.createToken({ authCode });
        const { authToken } = user.meta;
        if (!authToken) {
          handleAuthenticationFailure(dispatch, {
            status: 500,
            destroyCookie: true
          });
          return Promise.resolve();
        }
        handleAuthenticationSuccess(dispatch, {
          authToken,
          user,
          setCookie: true
        });
        setShouldRedirect(true);
      } catch (e) {
        setError({ status: e.status, heading: "Unable to Authenticate" });
      }
    };

    if (!errorParam) loginUser();
  }, [dispatch, errorParam, authCode]);

  if (shouldRedirect) return <Redirect to={redirectPath || "/"} />;

  return (
    <Styled.Section className="bg-neutral05">
      {error ? (
        <FatalError fatalError={{ error }} minHeight="60dvh" />
      ) : (
        <Styled.Container className="container">
          <Styled.Message>Logging you in...</Styled.Message>
        </Styled.Container>
      )}
    </Styled.Section>
  );
}

OAuth.displayName = "OAuth";
