import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import FormattedDate from "global/components/FormattedDate";
import * as Styled from "./styles";

export default function FlagsList({ flags }) {
  const { t } = useTranslation();

  return (
    <>
      <Form.SectionLabel
        headingAs="h3"
        label={t("glossary.flag_other")}
        id="flags-list-header"
        color="error"
      />
      <Styled.FlagsList>
        {flags.map(f => {
          const {
            attributes: { message, createdAt },
            relationships: { creator }
          } = f;
          return (
            <Styled.FlagWrapper>
              <Styled.FlagMeta>
                <FormattedDate format="MMM dd, yyyy" date={createdAt} />
                <span>{creator.attributes.fullName}</span>
              </Styled.FlagMeta>
              <Styled.FlagMessage>{message}</Styled.FlagMessage>
            </Styled.FlagWrapper>
          );
        })}
      </Styled.FlagsList>
    </>
  );
}

FlagsList.displayName = "Annotation.Detail.FlagsList";

FlagsList.propTypes = {
  flags: PropTypes.arrayOf(PropTypes.object)
};
