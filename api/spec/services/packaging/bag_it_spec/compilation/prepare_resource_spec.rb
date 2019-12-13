require "rails_helper"

RSpec.describe Packaging::BagItSpec::Compilation::PrepareResource, packaging: true do
  let!(:resource) { FactoryBot.create :resource, :image }

  let!(:operation) { described_class.new }

  it "generates a resource proxy" do
    expect(operation.call(resource)).to be_a_kind_of(Packaging::BagItSpec::Resources::Proxy)
  end
end
