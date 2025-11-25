import { useEffect, useRef } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import ResourceImport from "backend/components/resource-import";

function ResourceImportResults() {
  const { resourceImport, fetch, executeUpdate } = useOutletContext();
  const { projectId, id } = useParams();
  const intervalRef = useRef(null);

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
        fetch();
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

  const updateImportState = async state => {
    await executeUpdate({ attributes: { state } });
  };

  const { importResults } = resourceImport.attributes;

  // Construct match object for Control component compatibility
  const match = { params: { projectId, id } };

  return (
    <div>
      <div className="form-secondary">
        <ResourceImport.Control
          resourceImport={resourceImport}
          updateImportState={updateImportState}
          fetch={fetch}
          match={match}
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

ResourceImportResults.displayName = "ResourceImport.Results";

export default ResourceImportResults;
