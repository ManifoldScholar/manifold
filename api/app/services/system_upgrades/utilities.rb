module SystemUpgrades
  module Utilities
    extend ActiveSupport::Concern

    def elastic_connection_error
      logger.error("                                                                  ")
      logger.error("UPGRADE ERROR: Unable to connect to Elasticsearch                 ")
      logger.error("For this upgrade to complete successfully, Manifold must be able  ")
      logger.error("to establish a connection to Elasticsearch. Is Elasticsearch      ")
      logger.error("running at the location specified in the .env file?               ")
      abort
    end
  end
end
