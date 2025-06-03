import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import NewCategory from "./CategoryNew";
import * as Styled from "./styles";

function CategoryNewToggle({ isMarkdown, ...props }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const label = isMarkdown
    ? t("forms.category.add_markdown")
    : t("forms.category.add_category");

  return (
    <>
      <Styled.Button type="button" onClick={() => setIsOpen(true)}>
        <span>{label}</span>
        <IconComposer icon="circlePlus32" size={32} />
      </Styled.Button>
      {isOpen && (
        <NewCategory
          isMarkdown={isMarkdown}
          onClose={() => setIsOpen(false)}
          {...props}
        />
      )}
    </>
  );
}

CategoryNewToggle.propTypes = {
  isMarkdown: PropTypes.bool,
  groupId: PropTypes.string.isRequired,
  onError: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
  count: PropTypes.number
};

export default CategoryNewToggle;
