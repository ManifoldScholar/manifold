require("babel-polyfill");

const environmentConfiguration = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

const applicationConfiguration = {
  webServerPort: process.env.CLIENT_WEB_SERVER_PORT,
  webServerSocket: process.env.CLIENT_WEB_SERVER_SOCKET,
  universalServerPort: process.env.CLIENT_UNIVERSAL_SERVER_PORT,
  universalServerSocket: process.env.CLIENT_UNIVERSAL_SERVER_SOCKET,
  assetPort: process.env.CLIENT_ASSET_PORT,
  apiUrl: process.env.API_URL,
  cableUrl: process.env.CABLE_URL,
  assetProxyPaths: ['/dist'],
  apiProxyPaths: ['/api', '/system'],
  app: {
    title: 'Manifold Scholarship',
    description: 'Transforming scholarly publications into living digital works',
    meta: {
      charSet: 'utf-8',
      property: {
        'og:site_name': 'Manifold Scholarship',
        'og:image': 'manifold.umn.edu/logo/manifold_avatar-01.png',
        'og:locale': 'en_US',
        'og:title': 'Manifold Scholarship',
        'og:description': 'Transforming scholarly publications into living digital works',
        'twitter:card': 'summary',
        'twitter:site': '@manifoldscholar',
        'twitter:creator': '@manifoldscholar',
        'twitter:title': 'Manifold Scholarship',
        'twitter:description': 'Transforming scholarly publications into living digital works',
        'twitter:image': 'manifold.umn.edu/logo/manifold_avatar-01.png',
        'twitter:image:width': '200',
        'twitter:image:height': '200'
      }
    }
  }
};

module.exports = Object.assign({}, environmentConfiguration, applicationConfiguration);
