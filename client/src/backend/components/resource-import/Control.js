import Controls from "./controls";

export default function ResourceImportControl({
  resourceImport,
  updateImportState,
  projectId,
  importId,
  fetch
}) {
  if (!resourceImport) return null;

  const finishUrl = `/backend/projects/${projectId}/resources`;
  const backLinkUrl = `/backend/projects/${projectId}/resources/import/${importId}/map`;

  const resetImport = event => {
    event.preventDefault();
    updateImportState("mapped");
  };

  const startImport = event => {
    event.preventDefault();
    updateImportState("importing");
  };

  switch (resourceImport.attributes.state) {
    case "importing":
      return (
        <Controls.Importing
          resourceImport={resourceImport}
          refreshResults={fetch}
        />
      );
    case "imported":
      return (
        <Controls.Imported
          resourceImport={resourceImport}
          finishUrl={finishUrl}
          resetImport={resetImport}
        />
      );
    case "parsed":
    case "mapped":
      return (
        <Controls.Parsed
          resourceImport={resourceImport}
          backLinkUrl={backLinkUrl}
          startImport={startImport}
        />
      );
    default:
      return null;
  }
}
