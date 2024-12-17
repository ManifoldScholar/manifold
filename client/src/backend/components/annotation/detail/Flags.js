import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import FormattedDate from "global/components/FormattedDate";
import * as Styled from "./styles";

export default function FlagsList({
  flags,
  resolvedFlagsCount,
  unresolvedFlagsCount
}) {
  const { t } = useTranslation();

  return (
    <>
      <Form.SectionLabel
        headingAs="h3"
        label={t("glossary.flag_other")}
        id="flags-list-header"
        color={unresolvedFlagsCount ? "error" : undefined}
      />
      <Styled.FlagsList>
        {!!resolvedFlagsCount && (
          <Styled.FlagWrapper>
            <span>
              {t("records.annotations.resolved_flags_count", {
                count: resolvedFlagsCount
              })}
            </span>
          </Styled.FlagWrapper>
        )}
        {flags.map(f => {
          const {
            attributes: { message, createdAt, resolved },
            relationships: { creator }
          } = f;
          return !resolved ? (
            <Styled.FlagWrapper>
              <Styled.FlagMeta>
                <FormattedDate format="MMM dd, yyyy" date={createdAt} />
                <span>{creator.attributes.fullName}</span>
              </Styled.FlagMeta>
              <Styled.FlagMessage>{message}</Styled.FlagMessage>
            </Styled.FlagWrapper>
          ) : null;
        })}
      </Styled.FlagsList>
    </>
  );
}

FlagsList.displayName = "Annotation.Detail.FlagsList";

FlagsList.propTypes = {
  flags: PropTypes.arrayOf(PropTypes.object),
  hasResolvedFlags: PropTypes.bool
};
