import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import Button from "components/global/atomic/Button";
import * as Styled from "./styles";

export default function SearchForm({
  size = "sm",
  placeholder,
  defaultValue,
  value,
  onChange,
  onSubmit,
  autoFocus,
  action = "/lti/search",
  className,
  buttonBackground
}) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const label = t("lti.search.submit");
  const resolvedBackground =
    buttonBackground ?? (size === "md" ? "accent" : "neutral");
  const controlled = value !== undefined;
  const resolvedDefault = defaultValue ?? searchParams.get("keyword") ?? "";
  const inputProps = controlled
    ? { value, onChange }
    : { defaultValue: resolvedDefault, key: resolvedDefault };

  return (
    <Styled.Form
      action={onSubmit ? undefined : action}
      method="get"
      role="search"
      onSubmit={onSubmit}
      className={className}
    >
      <Styled.Input
        $size={size}
        type="search"
        name="keyword"
        placeholder={placeholder ?? `${label}…`}
        aria-label={label}
        autoFocus={autoFocus}
        {...inputProps}
      />
      <Button
        type="submit"
        size={size}
        background={resolvedBackground}
        label={label}
        preIcon="search16"
      />
    </Styled.Form>
  );
}
