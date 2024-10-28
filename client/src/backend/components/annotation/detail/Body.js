import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Collapse from "global/components/Collapse";
import Form from "global/components/form";
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
      <Collapse>
        <Styled.Toggle>
          <Styled.Content stubHeight={300}>
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
