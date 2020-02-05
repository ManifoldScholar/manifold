require "rails_helper"

RSpec.describe Ingestion, type: :model do

  include_context("authenticated request")
  include_context("param helpers")

  let(:attributes) {
    {
      source: markdown_source_params
    }
  }

  let(:ingestion) do
    ingestion = Ingestion.new(creator: admin)
    Updaters::Ingestion.new(build_json_structure(attributes: attributes)).update(ingestion)
    return ingestion
  end

  it "has a source attachment" do
    is_expected.to respond_to(:source).and respond_to(:source=)
  end
end
