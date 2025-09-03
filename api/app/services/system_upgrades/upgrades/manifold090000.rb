# frozen_string_literal: true

module SystemUpgrades
  module Upgrades
    class Manifold090000 < SystemUpgrades::AbstractVersion
      def perform!
        logger.info("[-ANY-]===================================================================")
        logger.info("[-ANY-] Rebuilding Search Indices for v9                                  ")
        logger.info("[-ANY-]===================================================================")
        logger.info("[-ANY-]V9 replaces ElasticSearch with Postgres seach, so all indexes must ")
        logger.info("[-ANY-]be rebuilt. This may take a few minutes, so now is a good time to  ")
        logger.info("[-ANY-]make that cup of tea.                                              ")
        logger.info("[-ANY-]===================================================================")

        ManifoldApi::Container["search.rebuild_all"].().value!
      end
    end
  end
end
