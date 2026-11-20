import { useEffect, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.min.mjs";

// Webpack emits the worker as a standalone asset (see base.config.js).
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

/**
 * Loads the PDF at `url`. Returns `{ pdf, error }`; both are null while
 * loading. The loading task is destroyed on unmount or when `url` changes.
 */
export default function usePdfDocument(url) {
  const [state, setState] = useState({ pdf: null, error: null });

  useEffect(() => {
    let cancelled = false;
    const loadingTask = getDocument({ url });

    loadingTask.promise
      .then(pdf => {
        if (!cancelled) setState({ pdf, error: null });
      })
      .catch(error => {
        // Destroying the task rejects the promise; that is not an error.
        if (!cancelled) setState({ pdf: null, error });
      });

    return () => {
      cancelled = true;
      loadingTask.destroy();
    };
  }, [url]);

  return state;
}
