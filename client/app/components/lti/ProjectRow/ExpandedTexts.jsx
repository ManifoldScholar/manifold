import { useTranslation } from "react-i18next";
import ExpandedTextRow from "./ExpandedTextRow";

export default function ExpandedTexts({ texts, project }) {
  const { t } = useTranslation();
  const trail = [
    { label: t("lti.breadcrumb.projects"), to: "/lti/projects" },
    { label: project.title, to: `/lti/projects/${project.id}` }
  ];

  return (
    <ul>
      {texts.map(text => (
        <ExpandedTextRow key={text.id} text={text} trail={trail} />
      ))}
    </ul>
  );
}
