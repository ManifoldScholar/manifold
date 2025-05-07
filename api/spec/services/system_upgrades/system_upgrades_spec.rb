# frozen_string_literal: true

RSpec.describe SystemUpgrades do
  # rubocop:todo RSpec/LeakyConstantDeclaration
  class Test000100 < SystemUpgrades::AbstractVersion # rubocop:todo Lint/ConstantDefinitionInBlock, RSpec/LeakyConstantDeclaration
    def perform!
  logger.debug "Test" # rubocop:todo Layout/IndentationWidth
    end
  end
  # rubocop:enable RSpec/LeakyConstantDeclaration

  # rubocop:todo RSpec/LeakyConstantDeclaration
  class Test000200 < SystemUpgrades::AbstractVersion # rubocop:todo Lint/ConstantDefinitionInBlock, RSpec/LeakyConstantDeclaration
    def perform!
  logger.debug "Test" # rubocop:todo Layout/IndentationWidth
    end
  end
  # rubocop:enable RSpec/LeakyConstantDeclaration

  it "retrieves and orders upgrade version files", :aggregate_failures do
    upgrades = described_class.eager_load_upgrades!

    expect(upgrades).to include(Test000100)
    expect(upgrades).to include(Test000200)
  end
end
