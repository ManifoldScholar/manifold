export default function mergeImageAltText(attributes = {}, ...imageFields) {
  const result = { ...attributes };
  imageFields.forEach(field => {
    const altTextKey = `${field}AltText`;
    if (typeof result[altTextKey] === "string") {
      result[field] = { ...result[field], altText: result[altTextKey] };
    }
    delete result[altTextKey];
  });
  return result;
}
