import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Button from "global/components/atomic/Button";
import usePdfDocument from "./usePdfDocument";
import usePdfPage from "./usePdfPage";
import useElementSize from "./useElementSize";
import * as Styled from "./styles";

/**
 * Minimal single-page PDF viewer. Loaded lazily so that pdf.js and its
 * worker are only fetched once a reader asks to view the file.
 */
function ResourceMediaPDFViewer({ url, title, fixedAspectRatio = false }) {
  const { t } = useTranslation();
  const [pageNumber, setPageNumber] = useState(1);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const size = useElementSize(stageRef);

  const { pdf, error: documentError } = usePdfDocument(url);
  const { rendering, error: pageError } = usePdfPage({
    pdf,
    pageNumber,
    canvasRef,
    size,
    contain: fixedAspectRatio
  });

  const pageCount = pdf?.numPages ?? 0;
  const loading = !documentError && (!pdf || rendering);

  if (documentError || pageError)
    return (
      <Styled.Message role="alert" $fixedAspectRatio={fixedAspectRatio}>
        {t("messages.pdf_viewer.error")}
      </Styled.Message>
    );

  return (
    <Styled.Wrapper $fixedAspectRatio={fixedAspectRatio}>
      <Styled.Stage ref={stageRef} $fixedAspectRatio={fixedAspectRatio}>
        <Styled.Canvas
          ref={canvasRef}
          role="img"
          aria-label={t("messages.pdf_viewer.page_label", {
            title,
            page: pageNumber
          })}
          hidden={!pdf}
        />
        {loading && (
          <Styled.Loading>{t("messages.pdf_viewer.loading")}</Styled.Loading>
        )}
      </Styled.Stage>
      {pdf && (
        <Styled.Toolbar>
          <Button
            size="sm"
            lowercase
            type="button"
            label={t("messages.pdf_viewer.previous_page")}
            onClick={() => setPageNumber(n => n - 1)}
            disabled={pageNumber <= 1}
          />
          <Styled.Status aria-live="polite">
            {t("messages.pdf_viewer.page_status", {
              page: pageNumber,
              total: pageCount
            })}
          </Styled.Status>
          <Button
            size="sm"
            lowercase
            type="button"
            label={t("messages.pdf_viewer.next_page")}
            onClick={() => setPageNumber(n => n + 1)}
            disabled={pageNumber >= pageCount}
          />
        </Styled.Toolbar>
      )}
    </Styled.Wrapper>
  );
}

ResourceMediaPDFViewer.displayName = "Resource.Media.PDF.Viewer";

ResourceMediaPDFViewer.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string,
  fixedAspectRatio: PropTypes.bool
};

export default ResourceMediaPDFViewer;
