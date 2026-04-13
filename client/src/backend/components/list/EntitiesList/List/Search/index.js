import { useState, useEffect, useId } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import Collapse from "global/components/Collapse";
import classNames from "classnames";
import isPlainObject from "lodash/isPlainObject";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

const RESERVED_NAMES = ["order", "keyword"];

function ListEntitiesListSearch({
  params = [],
  values = {},
  setParam,
  onReset,
  searchStyle = "horizontal",
  onFilterChange
}) {
  const id = useId();
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (values.keyword !== undefined) {
      setKeyword(values.keyword);
    }
  }, [values.keyword]);

  function ensureParamObject(param) {
    return isPlainObject(param) ? param : params.find(p => p.name === param);
  }

  function paramValue(paramLike) {
    const param = ensureParamObject(paramLike);
    return values[param.name] || "";
  }

  function paramLabel(paramLike) {
    const param = ensureParamObject(paramLike);
    return param.label || "";
  }

  function paramOptions(paramLike) {
    const param = ensureParamObject(paramLike);
    return param.options || [];
  }

  function hasParam(paramLike) {
    const param = ensureParamObject(paramLike);
    return isPlainObject(param);
  }

  const keywordParam = params.find(p => p.name === "keyword");
  const orderParam = params.find(p => p.name === "order");
  const hasOrderParam = hasParam(orderParam);
  const hasKeywordParam = hasParam(keywordParam);
  const filterParams = params.filter(
    p => !RESERVED_NAMES.includes(p.name) && !p.hidden
  );
  const hasFilterParams = filterParams.length > 0;
  const hasOptions = hasFilterParams || hasOrderParam;

  function handleSetParam(event, paramLike) {
    const param = ensureParamObject(paramLike);
    const value = event.target.value;
    setParam(param, value);
    if (onFilterChange) onFilterChange();
  }

  function submitKeywordForm(event) {
    event.preventDefault();
    setParam(keywordParam, keyword);
    if (onFilterChange) onFilterChange();
  }

  function resetSearch(event) {
    event.preventDefault();
    setKeyword("");
    onReset();
  }

  function translatedParamLabel(label) {
    switch (label) {
      case "Draft":
        return t("filters.labels.by_draft");
      case "Creator":
        return t("filters.labels.by_creator");
      case "Privacy":
        return t("filters.labels.by_privacy");
      case "Flags":
        return t("filters.labels.with_flags");
      case "Order":
        return t("filters.labels.sort_results");
      case "Role":
        return t("filters.labels.by_role");
      case "Tag":
        return t("filters.labels.by_tag");
      case "Kind":
        return t("filters.labels.by_kind");
      case "Type":
        return t("filters.labels.by_type");
      default:
        return "";
    }
  }

  function classNameWithStyle(className) {
    return classNames({
      [className]: true,
      [`${className}--horizontal`]: searchStyle === "horizontal",
      [`${className}--vertical`]: searchStyle === "vertical"
    });
  }

  const baseClass = "entity-list-search";

  /* eslint-disable react/no-array-index-key */
  /* these filters never change after render */
  return (
    <div className={`entity-list__search ${baseClass}`}>
      <Collapse>
        {hasKeywordParam && (
          <form role="search" onSubmit={submitKeywordForm}>
            <div className={`${baseClass}__keyword-row`}>
              <button className={`${baseClass}__search-button`}>
                <Utility.IconComposer icon="search16" size={20} />
                <span className="screen-reader-text">{t("search.title")}</span>
              </button>
              <div className={`${baseClass}__keyword-input-wrapper`}>
                <label htmlFor={id} className="screen-reader-text">
                  {t("search.instructions")}
                </label>
                <input
                  className={`${baseClass}__keyword-input`}
                  id={id}
                  value={keyword}
                  type="text"
                  placeholder={paramLabel(keywordParam)}
                  onChange={e => setKeyword(e.target.value)}
                />
              </div>
              <button
                type="reset"
                onClick={resetSearch}
                className={`${baseClass}__text-button`}
              >
                {t("actions.reset")}
              </button>
              {hasOptions && (
                <Collapse.Toggle
                  className={`${baseClass}__text-button ${baseClass}__text-button--foregrounded`}
                >
                  {t("glossary.option_title_case_other")}
                </Collapse.Toggle>
              )}
            </div>
          </form>
        )}
        {hasOptions && (
          <Collapse.Content>
            <div className={classNameWithStyle(`${baseClass}__options`)}>
              {filterParams.map((param, i) => {
                return (
                  <div
                    key={i}
                    className={classNameWithStyle(`${baseClass}__option`)}
                  >
                    <div>
                      <div className="rel">
                        <Styled.SelectLabel htmlFor={`${id}-filter-${i}`}>
                          {translatedParamLabel(param.label)}
                        </Styled.SelectLabel>
                        <Styled.Select
                          id={`${id}-filter-${i}`}
                          onChange={e => handleSetParam(e, param)}
                          value={paramValue(param)}
                        >
                          {paramOptions(param).map((option, optionIndex) => (
                            <option
                              key={optionIndex}
                              value={option.value || ""}
                            >
                              {option.label}
                            </option>
                          ))}
                        </Styled.Select>
                        <Styled.Icon icon="disclosureDown24" />
                      </div>
                    </div>
                  </div>
                );
              })}
              {hasOrderParam && (
                <div className={classNameWithStyle(`${baseClass}__option`)}>
                  <div>
                    <Styled.SelectLabel>
                      {t("filters.labels.sort_results")}
                    </Styled.SelectLabel>
                    <div className="rel">
                      <label
                        htmlFor={`${id}-order`}
                        className="screen-reader-text"
                      >
                        {t("filters.labels.sort_results")}
                      </label>
                      <Styled.Select
                        id={`${id}-order`}
                        onChange={e => handleSetParam(e, orderParam)}
                        value={paramValue(orderParam)}
                      >
                        {paramOptions(orderParam).map((option, optionIndex) => (
                          <option key={optionIndex} value={option.value || ""}>
                            {option.label}
                          </option>
                        ))}
                      </Styled.Select>
                      <Styled.Icon icon="disclosureDown24" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Collapse.Content>
        )}
      </Collapse>
    </div>
  );
}

ListEntitiesListSearch.displayName = "List.Entities.List.Search";

ListEntitiesListSearch.propTypes = {
  params: PropTypes.array,
  values: PropTypes.object,
  setParam: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  searchStyle: PropTypes.oneOf(["horizontal", "vertical"]),
  onFilterChange: PropTypes.func
};

export default ListEntitiesListSearch;
