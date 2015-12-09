require('babel-core/polyfill');

const environmentConfiguration = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

const applicationConfiguration = {
  clientPort: process.env.MANIFOLD_CLIENT_PORT,
  assetPort: process.env.MANIFOLD_ASSET_PORT,
  apiUri: process.env.MANIFOLD_API_URL,
  assetProxyPaths: ['/dist'],
  apiProxyPaths: ['/api', '/system/resources'],
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
