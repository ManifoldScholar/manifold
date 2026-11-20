import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import loadable from "@loadable/component";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

// pdf.js and its worker live in this chunk; nothing loads until a reader
// asks to view the PDF.
const LoadableViewer = loadable(() =>
  import(/* webpackChunkName: "pdf-viewer" */ "./Viewer")
);

function ResourceMediaPDF({ resource, fixedAspectRatio, active = true }) {
  const { t } = useTranslation();
  const [viewing, setViewing] = useState(false);
  const {
    altText,
    title,
    attachmentStyles,
    variantThumbnailStyles,
    variantThumbnailAltText
  } = resource.attributes;

  // Return to the poster (unmounting the viewer) when a slide is left.
  useEffect(() => {
    if (active === false) setViewing(false);
  }, [active]);

  // pdf.js fetches the file itself, so the storage origin must allow
  // cross-origin requests from the client.
  const pdfUrl = attachmentStyles?.original;

  if (viewing && pdfUrl)
    return (
      <Styled.ViewerWrapper $fixedAspectRatio={fixedAspectRatio}>
        <LoadableViewer
          url={pdfUrl}
          title={title}
          fixedAspectRatio={!!fixedAspectRatio}
          fallback={
            <Styled.Loading $fixedAspectRatio={fixedAspectRatio}>
              {t("messages.pdf_viewer.loading")}
            </Styled.Loading>
          }
        />
      </Styled.ViewerWrapper>
    );

  const imgProps = variantThumbnailStyles?.largeLandscape
    ? {
        src: variantThumbnailStyles.largeLandscape,
        alt: variantThumbnailAltText
      }
    : { src: attachmentStyles?.largeLandscape, alt: altText || "" };

  // TODO get dimensions from API
  return (
    <Styled.Poster $fixedAspectRatio={fixedAspectRatio}>
      <Styled.Image
        {...imgProps}
        loading="lazy"
        $fixedAspectRatio={fixedAspectRatio}
      />
      {pdfUrl && (
        <Styled.ViewButton
          size="sm"
          background="neutral"
          type="button"
          label={t("messages.pdf_viewer.view")}
          onClick={() => setViewing(true)}
        />
      )}
    </Styled.Poster>
  );
}

ResourceMediaPDF.displayName = "Resource.Media.PDF";

ResourceMediaPDF.propTypes = {
  resource: PropTypes.object.isRequired,
  fixedAspectRatio: PropTypes.bool,
  active: PropTypes.bool
};

export default ResourceMediaPDF;
