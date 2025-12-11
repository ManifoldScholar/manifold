import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Collapse from "components/global/Collapse";
import Form from "components/global/form";
import * as Styled from "./styles";

export default function AnnotationBody({ body }) {
  const { t } = useTranslation();

  return (
    <>
      <Form.SectionLabel
        headingAs="h3"
        label={t("common.content")}
        id="annotation-body-header"
      />
      <Collapse stubHeight={300}>
        <Styled.Toggle>
          <Styled.Content>
            {body && (
              <Styled.Body className="entity-row__title entity-row__title">
                {body}
              </Styled.Body>
            )}
            <Styled.Overlay />
          </Styled.Content>
        </Styled.Toggle>
      </Collapse>
    </>
  );
}

AnnotationBody.displayName = "Annotation.Detail.Body";

AnnotationBody.propTypes = {
  body: PropTypes.string
};
