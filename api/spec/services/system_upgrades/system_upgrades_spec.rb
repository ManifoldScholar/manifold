# frozen_string_literal: true

RSpec.describe SystemUpgrades do
  class Test000100 < SystemUpgrades::AbstractVersion
    def perform!
      logger.debug "Test"
    end
  end

  class Test000200 < SystemUpgrades::AbstractVersion
    def perform!
      logger.debug "Test"
    end
  end

  it "retrieves and orders upgrade version files", :aggregate_failures do
    upgrades = SystemUpgrades.eager_load_upgrades!

    expect(upgrades).to include(Test000100)
    expect(upgrades).to include(Test000200)
  end
end
