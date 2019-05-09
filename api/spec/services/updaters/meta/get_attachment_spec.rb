require "rails_helper"

RSpec.describe Updaters::Meta::GetAttachment, data_uri: true, interaction: true do
  let(:data) { manifold_logo_data_uri }
  let(:filename) { "manifold.png" }

  let(:interaction_inputs) { { data: data, filename: filename } }

  it "creates a data file from a URI" do
    perform_within_expectation! valid: true

    expect(@outcome.result).to be_a_kind_of(Shrine::Plugins::DataUri::DataFile)
  end

  context "with invalid data" do
    let(:data) { "guaranteed not to parse" }

    it "fails silently" do
      perform_within_expectation! valid: true

      expect(@outcome.result).to be_nil
    end
  end
end
