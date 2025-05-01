import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import FormattedDate from "global/components/FormattedDate";
import * as Styled from "./styles";

export default function FlagsList({
  flags,
  resolvedFlagsCount,
  unresolvedFlagsCount,
}) {
  const { t } = useTranslation();

  const active = flags.filter((flag) => !flag.attributes.resolved);

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
            <span style={{ color: "var(--color-neutral-text-extra-light)" }}>
              <b>{resolvedFlagsCount}</b>{" "}
              {t("records.annotations.resolved_flags_count", {
                count: resolvedFlagsCount,
              })}
            </span>
          </Styled.FlagWrapper>
        )}
        {active.map((f) => {
          const {
            attributes: { message, createdAt },
            relationships: { creator },
          } = f;
          return (
            <Styled.FlagWrapper>
              <Styled.FlagMeta>
                <FormattedDate format="MMM dd, yyyy" date={createdAt} />
                <span>{creator.attributes.fullName}</span>
              </Styled.FlagMeta>
              {message && <Styled.FlagMessage>{message}</Styled.FlagMessage>}
            </Styled.FlagWrapper>
          );
        })}
      </Styled.FlagsList>
    </>
  );
}

FlagsList.displayName = "Annotation.Detail.FlagsList";

FlagsList.propTypes = {
  flags: PropTypes.arrayOf(PropTypes.object),
  resolvedFlagsCount: PropTypes.number,
  unresolvedFlagsCount: PropTypes.number,
};
