import { server } from 'universal-webpack'
import settings from '../../webpack/react-server-webpack-settings'
import configuration from '../../webpack/webpack.config'
server(configuration, settings)
