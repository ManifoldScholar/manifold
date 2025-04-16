# frozen_string_literal: true

require "rails_helper"

RSpec.describe Ingestions::Pickers::Strategy do
  include TestHelpers::IngestionHelper

  let(:path) { nil }
  let(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
  let(:context) { create_context(ingestion) }
  let(:outcome) { described_class.run context: context }

  shared_examples_for "strategy picker fails" do
    it "to find a valid strategy" do
      expect(outcome).not_to be_valid
    end
  end

  shared_examples_for "assigned strategy" do |expected|
    it "is the #{expected} strategy" do
      expect(outcome).to be_valid
      expect(outcome.result.name).to be expected
    end
  end
end
