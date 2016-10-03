import { server_configuration } from 'universal-webpack'
import settings from './react-server-webpack-settings'
import configuration from './webpack.config'

const config = server_configuration(configuration, settings)

config.node = {
  __dirname: false,
  __filename: false
}

export default config
