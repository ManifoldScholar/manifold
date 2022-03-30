export const renderOffer = attributes => {
  const { purchasePrice, purchasePriceCurrency, purchaseUrl } = attributes;
  const showOffer = purchasePrice && purchasePriceCurrency && purchaseUrl;

  return showOffer
    ? {
        "@type": "Offer",
        price: purchasePrice,
        priceCurrency: purchasePriceCurrency,
        url: purchaseUrl
      }
    : null;
};

export const renderSeries = metadata => {
  const { seriesTitle } = metadata;

  return seriesTitle
    ? {
        "@type": "CreativeWorkSeries",
        name: seriesTitle
      }
    : null;
};

export const renderNamesList = persons => {
  return persons?.length
    ? persons.map(p => ({
        "@type": "Person",
        name: p.attributes.fullName
      }))
    : null;
};
