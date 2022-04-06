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

export const renderJournal = journal => {
  return journal
    ? {
        "@type": "Periodical",
        name: journal.attributes.title
      }
    : null;
};

export const renderVolumes = (volumes, journal) => {
  if (!volumes.length) return {};

  return volumes.map(volume => ({
    "@type": "PublicationVolume",
    volumeNumber: volume.attributes.number,
    datePublished: volume.attributes.publicationDate,
    isPartOf: journal ? renderJournal(journal) : null
  }));
};
