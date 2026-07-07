import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function KeywordInput({
  inputProps,
  inputKey,
  placeholder,
  autoFocus,
  showClear,
  onClear
}) {
  const { t } = useTranslation();

  return (
    <Styled.Wrapper>
      <Styled.SearchIcon type="submit" aria-label={t("search.execute")}>
        <IconComposer icon="search16" size={24} />
      </Styled.SearchIcon>
      <Styled.SearchInput
        key={inputKey}
        type="text"
        placeholder={placeholder ?? t("search.placeholder_long")}
        autoFocus={autoFocus}
        {...inputProps}
      />
      {showClear && (
        <Styled.ClearButton
          type="button"
          onClick={onClear}
          aria-label={t("actions.clear")}
        >
          <span className="utility-primary">{t("actions.clear")}</span>
          <IconComposer icon="close16" size={16} />
        </Styled.ClearButton>
      )}
    </Styled.Wrapper>
  );
}

KeywordInput.displayName = "Search.Query.KeywordInput";

KeywordInput.propTypes = {
  inputProps: PropTypes.object,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  showClear: PropTypes.bool,
  onClear: PropTypes.func
};
