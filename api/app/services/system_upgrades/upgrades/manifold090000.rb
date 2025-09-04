# frozen_string_literal: true

module SystemUpgrades
  module Upgrades
    class Manifold090000 < SystemUpgrades::AbstractVersion
      def perform!
        logger.info("[-ANY-]===================================================================")
        logger.info("[-ANY-] Upgrading Manifold to v9                                          ")
        logger.info("[-ANY-]===================================================================")
      end
    end
  end
end
