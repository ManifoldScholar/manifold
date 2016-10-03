import { client_configuration } from 'universal-webpack'
import settings from './react-server-webpack-settings'
import configuration from './webpack.config'

export default client_configuration(configuration, settings)
