# frozen_string_literal: true

module SystemUpgrades
  module Upgrades
    class Manifold080200 < SystemUpgrades::AbstractVersion
      def perform!
        TextSection.extrapolate_all_nodes!
      end
    end
  end
end
