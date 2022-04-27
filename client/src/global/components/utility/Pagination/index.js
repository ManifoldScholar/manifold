import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "../IconComposer";
import Link from "./Link";
import usePagination, { ELLIPSIS_CHAR } from "./hooks/usePagination";
import * as Styled from "./styles";

function Pagination({
  pagination = {},
  padding,
  compact = false,
  ...linkProps
}) {
  const { t } = useTranslation();
  const pages = usePagination({ ...pagination, padding });

  if (!pages || pages.length < 2) return null;

  if (compact)
    return (
      <span>
        {t("pagination.compact", {
          current: pagination.currentPage,
          total: pagination.totalPages
        })}
      </span>
    );

  return (
    <Styled.Nav aria-label={t("pagination.aria_label")}>
      <Styled.Columns>
        <Styled.Column>
          <Link
            page={pagination.prevPage}
            disabled={!pagination.prevPage}
            aria-label={t("pagination.previous_page")}
            {...linkProps}
          >
            <IconComposer icon="arrowLongLeft16" />
            <span>{t("pagination.previous_short")}</span>
          </Link>
        </Styled.Column>
        <Styled.Column>
          <Styled.Pages>
            {pages.map((page, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <React.Fragment key={index}>
                {page === ELLIPSIS_CHAR && (
                  <Styled.Ellipsis>{ELLIPSIS_CHAR}</Styled.Ellipsis>
                )}
                {page !== ELLIPSIS_CHAR && (
                  <Link
                    page={page}
                    aria-current={
                      page === pagination.currentPage ? "page" : null
                    }
                    aria-label={t("pagination.page_number", { number: page })}
                    {...linkProps}
                  >
                    {page}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </Styled.Pages>
        </Styled.Column>
        <Styled.Column>
          <Link
            page={pagination.nextPage}
            disabled={!pagination.nextPage}
            aria-label={t("pagination.next_page")}
            {...linkProps}
          >
            <span>{t("pagination.next")}</span>
            <IconComposer icon="arrowLongRight16" />
          </Link>
        </Styled.Column>
      </Styled.Columns>
    </Styled.Nav>
  );
}

Pagination.displayName = "Utility.Pagination";

Pagination.propTypes = {
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    nextPage: PropTypes.number,
    perPage: PropTypes.number,
    prevPage: PropTypes.number,
    totalCount: PropTypes.number,
    totalPages: PropTypes.number
  }),
  paginationTarget: PropTypes.string,
  padding: PropTypes.number,
  paginationClickHandler: PropTypes.func,
  compact: PropTypes.bool
};

export default Pagination;
