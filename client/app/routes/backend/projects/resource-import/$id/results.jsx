import { useEffect, useRef } from "react";
import { useParams, useRevalidator } from "react-router";
import { resourceImportsAPI } from "api";
import { useApiCallback } from "hooks";
import ResourceImport from "backend/components/resource-import";
import loadEntity from "app/routes/utility/loaders/loadEntity";

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => resourceImportsAPI.show(params.id, params.importId),
    request
  });
};

export default function ResourceImportResults({
  loaderData: resourceImport
}) {
  const { id, importId } = useParams();
  const revalidator = useRevalidator();
  const intervalRef = useRef(null);

  const executeUpdateCall = useApiCallback((projectId, impId, attrs) =>
    resourceImportsAPI.update(projectId, impId, attrs)
  );

  const executeUpdate = async attributes => {
    await executeUpdateCall(id, importId, attributes);
    revalidator.revalidate();
  };

  const updateImportState = async state => {
    await executeUpdate({ attributes: { state } });
  };

  const refresh = () => {
    revalidator.revalidate();
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
        revalidator.revalidate();
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
    <div>
      <div className="form-secondary">
        <ResourceImport.Control
          resourceImport={resourceImport}
          updateImportState={updateImportState}
          fetch={refresh}
          projectId={id}
          importId={importId}
        />
        <div>
          <nav className="results-list">
            <ul>
              {importResults.map(r => {
                return (
                  <ResourceImport.Result
                    resourceImportRow={r}
                    key={r.lineNumber}
                  />
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
