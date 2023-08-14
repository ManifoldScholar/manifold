import abilities from "../structures/abilities";

const settings = () => ({
  type: "settings",
  attributes: {
    abilities: abilities(),
    general: {
      installationName: "Manifold",
      contactUrl: "http://www.dailyrowan.com",
      copyright: "2015-2016 6 University of Minnesota Press"
    },
    theme: {
      typekitId: "typekitId",
      logoStyles: `{"left": -1}`
    },
    integrations: {
      gaFourTrackingId: null,
      twitterAppId: null,
      facebookAppId: null,
      googleClientId: null,
      googleProjectId: null,
      googleClientEmail: null,
      twitterAccessToken: null,
      googlePrivateKeyId: null,
      googleOauthClientId: null
    },
    secrets: {
      googlePrivateKey: null,
      twitterAppSecret: null,
      facebookAppSecret: null,
      googleOauthClientSecret: null,
      twitterAccessTokenSecret: null
    },
    oauth: {
      facebook: {
        enabled: false
      },
      googleOauth2: {
        enabled: true,
        name: "google"
      },
      twitter: {
        enabled: true,
        name: "twitter"
      }
    },
    pressLogoStyles: {
      small: null,
      smallSquare: null,
      smallLandscape: null,
      smallPortrait: null,
      medium: null,
      mediumSquare: null,
      mediumLandscape: null,
      mediumPortrait: null,
      largeLandscape: null,
      original: null
    },
    copyrightFormatted: "2015-2016 6 University of Minnesota Press"
  }
});

export default settings;
