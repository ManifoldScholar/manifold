import { useRouteError, isRouteErrorResponse, useLocation } from "react-router";
import { useBodyClass } from "hooks";
import FatalError from "components/global/FatalError";
import formatError from "lib/react-router/helpers/formatError";
import * as Styled from "./styles";

const STATUSES = [404, 401, 403, 500];

export function ErrorBoundary() {
  const error = useRouteError();
  const location = useLocation();

  useBodyClass("browse");

  if (
    isRouteErrorResponse(error) ||
    (!!error.status && STATUSES.includes(error.status))
  ) {
    const errorProps = formatError(error, location.pathname);

    return (
      <Styled.Wrapper>
        <Styled.Main>
          <Styled.List>
            <FatalError {...errorProps} contained />
          </Styled.List>
        </Styled.Main>
      </Styled.Wrapper>
    );
  }

  throw error;
}
