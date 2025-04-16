# frozen_string_literal: true

require "rails_helper"

RSpec.describe SystemUpgrades::AbstractVersion do
  # rubocop:todo RSpec/LeakyConstantDeclaration
  class Test000100 < SystemUpgrades::AbstractVersion # rubocop:todo Lint/ConstantDefinitionInBlock, RSpec/LeakyConstantDeclaration
    def perform!
  logger.debug "Test" # rubocop:todo Layout/IndentationWidth
    end
  end
  # rubocop:enable RSpec/LeakyConstantDeclaration

  it "creates an UpgradeResult record on first execution" do
    expect { Test000100.run }.to change(UpgradeResult, :count).by 1
  end

  context "the corresponding UpgradeResult" do
    before(:context) do # rubocop:todo RSpec/BeforeAfterAll
      Test000100.run
    end

    it "has the correct version" do
      expect(UpgradeResult.first.version).to eq "0.1.0"
    end

    it "saves the output log" do
      expect(UpgradeResult.first.output).to include "Test"
    end
  end

  context "when upgrade has already been run" do
    before(:context) do # rubocop:todo RSpec/BeforeAfterAll
      Test000100.run
    end

    it "does not run upgrade without force option" do
      expect_any_instance_of(Test000100).not_to receive(:perform!) # rubocop:todo RSpec/AnyInstance
      Test000100.run
    end

    it "does run upgrade with force option" do
      expect_any_instance_of(Test000100).to receive(:perform!) # rubocop:todo RSpec/AnyInstance
      Test000100.run force: true
    end
  end
end
