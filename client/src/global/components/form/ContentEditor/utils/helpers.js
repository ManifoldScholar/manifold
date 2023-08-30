/* eslint-disable camelcase */
import { html_beautify } from "js-beautify";
import { markElements } from "./elements";

export const formatHtml = html => {
  const options = {
    indent_with_tabs: true,
    preserve_newlines: false,
    end_with_newline: false,
    wrap_line_length: "0",
    indent_inner_html: true,
    inline: [...markElements],
    unformatted: [...markElements, "pre"]
  };

  return html_beautify(html, options);
};

export const isValidUrl = str => {
  try {
    return Boolean(new URL(str));
  } catch (e) {
    return false;
  }
};

export const isImageUrl = url => {
  if (!url) return false;
  if (!isValidUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop();
  return ["gif", "jpg", "jpeg", "png", "svg"].includes(ext);
};

/* eslint-disable no-useless-escape */
const vimeoRegex = /^(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)$/gim;

const ytRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/gm;

export const isVideoUrl = url => {
  const isYT = ytRegex.test(url);
  const isVimeo = vimeoRegex.test(url);
  return isYT || isVimeo;
};
