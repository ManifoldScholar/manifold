import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Issue from "backend/components/issue";
import Layout from "backend/components/layout";

export default function JournalIssueNew() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { requestKey, closeUrl, journal } = useOutletContext() || {};

  const handleSuccess = () => {
    navigate(closeUrl, { state: { keepNotifications: false } });
  };

  if (!journal) return null;

  return (
    <div>
      <Layout.DrawerHeader title={t("issues.create_header")} />
      <Issue.Form
        journalId={journal.id}
        onSuccess={handleSuccess}
        options={{
          refreshes: requestKey
        }}
      />
    </div>
  );
}
