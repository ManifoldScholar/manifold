import { useEffect, useRef } from "react";
import { useParams, useOutletContext, useRevalidator } from "react-router";
import { resourceImportsAPI } from "api";
import { useApiCallback } from "hooks";
import ResourceImport from "components/backend/resource-import";

export default function ResourceImportResults() {
  const { pId, id } = useParams();
  const resourceImport = useOutletContext();
  const { revalidate } = useRevalidator();
  const intervalRef = useRef(null);

  const executeUpdateCall = useApiCallback((projectId, impId, attrs) =>
    resourceImportsAPI.update(projectId, impId, attrs)
  );

  const executeUpdate = async attributes => {
    await executeUpdateCall(pId, id, attributes);
    revalidate();
  };

  const updateImportState = async state => {
    await executeUpdate({ attributes: { state } });
  };

  const stopMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const maybeStartMonitoring = () => {
    const { state } = resourceImport.attributes;
    if (state === "importing" && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        revalidate();
      }, 5000);
    }
  };

  const maybeStopMonitoring = () => {
    const { state } = resourceImport.attributes;
    if (state !== "importing" && intervalRef.current) {
      stopMonitoring();
    }
  };

  useEffect(() => {
    maybeStartMonitoring();
    maybeStopMonitoring();

    return () => {
      stopMonitoring();
    };
  });

  const { importResults } = resourceImport.attributes;

  return (
    <div className="form-secondary">
      <ResourceImport.Control
        resourceImport={resourceImport}
        updateImportState={updateImportState}
        fetch={revalidate}
        projectId={pId}
        importId={id}
      />
      <nav className="results-list">
        <ul>
          {importResults.map(r => {
            return (
              <ResourceImport.Result resourceImportRow={r} key={r.lineNumber} />
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
