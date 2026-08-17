# frozen_string_literal: true

module SystemUpgrades
  UPGRADES_ROOT = Rails.root.join("app", "services", "system_upgrades", "upgrades")

  class << self
    def load_upgrade_classes!
      # :nocov:
      return upgrades if Rails.env.test?

      UPGRADES_ROOT.each_child do |child|
        next unless child.fnmatch("*.rb")

        require child
      end

      upgrades
      # :nocov:
    end

    def upgrades
      SystemUpgrades::AbstractVersion.descendants.sort_by(&:version)
    end
  end
end
