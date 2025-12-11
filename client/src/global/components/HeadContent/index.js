import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import Utility from "../utility";
import unescape from "lodash/unescape";
import get from "lodash/get";
import config from "config";
import { useSettings } from "hooks";

const addMeta = (meta, key, value, overrideKey = null) => {
  if (!value) return;
  meta.push({ name: overrideKey || key, content: value });
};

const addOpenGraph = (meta, key, value, overrideKey = null) => {
  addMeta(meta, key, value, `og:${overrideKey || key}`);
};

export function HeadContentComponent({
  title: titleProp,
  image: imageProp,
  imageWidth,
  imageHeight,
  locale,
  charset = config.app.head.meta.charset,
  description: descriptionProp,
  appendDefaultTitle = config.app.head.meta.appendDefaultTitle
}) {
  const settings = useSettings();

  const defaultTitle = get(settings, "attributes.general.headTitle");
  const title = unescape(titleProp);
  const appendedTitle = appendDefaultTitle
    ? `${title} | ${defaultTitle}`
    : title;

  const description =
    descriptionProp || get(settings, "attributes.general.headDescription");

  const image =
    imageProp ||
    get(settings, "attributes.pressLogoStyles.medium") ||
    `${config.services.client.url}/static/logo.jpg`;

  const meta = [];
  meta.push({ charset });
  addMeta(meta, "description", description);
  addOpenGraph(meta, "siteName", defaultTitle, "site_name");
  addOpenGraph(meta, "locale", locale);
  addOpenGraph(meta, "image", image);
  addOpenGraph(meta, "title", appendedTitle);
  addOpenGraph(meta, "description", description);
  addOpenGraph(meta, "imageWidth", imageWidth, "image:width");
  addOpenGraph(meta, "imageHeight", imageHeight, "image:height");

  const titleTemplate = appendDefaultTitle ? `%s | ${defaultTitle}` : null;

  return (
    <>
      <Helmet
        meta={meta}
        title={title}
        titleTemplate={titleTemplate}
        defaultTitle={defaultTitle}
      />
      <Utility.RouteAnnouncer title={title ?? defaultTitle} />
    </>
  );
}

HeadContentComponent.propTypes = {
  title: PropTypes.string,
  image: PropTypes.string,
  imageWidth: PropTypes.string,
  imageHeight: PropTypes.string,
  locale: PropTypes.string,
  charset: PropTypes.string,
  description: PropTypes.string,
  appendDefaultTitle: PropTypes.bool
};

export default HeadContentComponent;
