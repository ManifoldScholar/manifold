import { Link, useLocation, useMatches } from "react-router";
import { useTranslation } from "react-i18next";
import ClientOnly from "components/global/utility/ClientOnly";
import * as Styled from "./styles";

export default function Breadcrumbs() {
  const { t } = useTranslation();
  const location = useLocation();
  const matches = useMatches();

  const crumbs = matches.flatMap(match => {
    const fn = match.handle?.breadcrumb;
    if (!fn) return [];
    try {
      const result = fn(match, location, t);
      if (!result) return [];
      return Array.isArray(result) ? result : [result];
    } catch {
      return [];
    }
  });

  return (
    <ClientOnly>
      <Styled.Nav>
        <Link to="/lti">{t("lti.home")}</Link>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={`${crumb.to ?? crumb.label}-${i}`}>
              <Styled.Separator aria-hidden="true">/</Styled.Separator>
              {isLast || !crumb.to ? (
                <span aria-current={isLast ? "page" : undefined}>
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.to}>{crumb.label}</Link>
              )}
            </span>
          );
        })}
      </Styled.Nav>
    </ClientOnly>
  );
}
