require "rails_helper"

RSpec.describe SystemUpgrades::Perform do
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

  it "retrieves and orders upgrade version files" do
    expect(SystemUpgrades::Perform.new.upgrade_interactions).to match_array([Test000100, Test000200])
  end

end
