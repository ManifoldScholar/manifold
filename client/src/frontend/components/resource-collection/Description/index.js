import React from "react";
import { useTranslation } from "react-i18next";
import FormattedDate from "global/components/FormattedDate";
import * as Styled from "./styles";

export default function Description({ date, description }) {
  const { t } = useTranslation();

  return (
    <Styled.Wrapper>
      <Styled.DateWrapper>
        <FormattedDate
          prefix={t("dates.collection_created")}
          format="MMMM yyyy"
          date={date}
        />
      </Styled.DateWrapper>
      <Styled.Description
        dangerouslySetInnerHTML={{
          __html: description
        }}
      />
    </Styled.Wrapper>
  );
}

Description.displayName = "Frontend.Components.ResourceCollection.Description";
