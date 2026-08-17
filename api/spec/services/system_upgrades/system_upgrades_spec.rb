# frozen_string_literal: true

# :nocov:
class Test000100 < SystemUpgrades::AbstractVersion
  def perform!
    logger.debug "Test"
  end
end if Rails.env.test?

class Test000200 < SystemUpgrades::AbstractVersion
  def perform!
    logger.debug "Test"
  end
end if Rails.env.test?
# :nocov:

RSpec.describe SystemUpgrades do
  it "retrieves and orders upgrade version files", :aggregate_failures do
    upgrades = described_class.load_upgrade_classes!

    expect(upgrades).to include(Test000100)
    expect(upgrades).to include(Test000200)
  end
end
