import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import { useTranslation } from "react-i18next";
import Collapse from "global/components/Collapse";
import LabelSet from "../LabelSet";
import { useUID } from "react-uid";
import * as Styled from "./styles";

export default function EntitlementImportRow({ entity: csv }) {
  const { t } = useTranslation();
  const id = useUID();

  const { name, fileName, fileUrl, messages, currentState } =
    csv?.attributes ?? {};

  const utility = (
    <div>
      <a
        className="entity-row__utility-button"
        href={fileUrl}
        download
        onClick={e => e.stopPropagation()}
      >
        <Utility.IconComposer icon="download24" size={26} />
      </a>
    </div>
  );

  return csv ? (
    <Collapse>
      <Styled.Item className="entity-row entity-list__entity">
        <Styled.Toggle>
          <Styled.Inner className="entity-row__inner entity-row__inner--in-rows">
            <div className="entity-row__text entity-row__text--in-rows">
              <h3 className="entity-row__title entity-row__title--in-rows">
                <span className="entity-row__title-inner">{name}</span>
                <LabelSet labels={[currentState]} />
                <span id={`${id}-describedby`} className="screen-reader-text">
                  {name}
                </span>
              </h3>
              <h4 className="entity-row__subtitle entity-row__subtitle--in-rows">
                {fileName}
              </h4>
            </div>
            <div className="entity-row__utility">{utility}</div>
          </Styled.Inner>
        </Styled.Toggle>
        <Collapse.Content>
          <Styled.Messages>
            <Styled.MessagesTitle>
              {t("entitlements.imports.results_header")}
            </Styled.MessagesTitle>
            {messages.map(m => (
              <Styled.Message key={m}>{m}</Styled.Message>
            ))}
          </Styled.Messages>
        </Collapse.Content>
      </Styled.Item>
    </Collapse>
  ) : null;
}

EntitlementImportRow.displayName = "EntitiesList.Entity.EntitlementImportRow";

EntitlementImportRow.propTypes = {
  entity: PropTypes.object
};
