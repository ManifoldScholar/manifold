module SystemUpgrades
  UPGRADES_ROOT = Rails.root.join("app", "services", "system_upgrades", "upgrades")

  class << self
    # @return [<Class>]
    def eager_load_upgrades!
      return upgrades if Rails.env.test?

      Rails.application.eager_load!

      UPGRADES_ROOT.each_child do |child|
        next unless child.fnmatch("*.rb")

        require child
      end

      upgrades
    end

    def upgrades
      SystemUpgrades::AbstractVersion.descendants.sort_by(&:version)
    end
  end
end
