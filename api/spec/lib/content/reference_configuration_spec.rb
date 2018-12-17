require "rails_helper"

RSpec.describe Content::ReferenceConfiguration do
  let(:configuration) do
    described_class.new(name: "featured_resources", required: false, multiple: false, source: "Resource")
  end

  it "responds to :required" do
    expect(configuration.respond_to? :required).to eq true
  end

  it "responds to :name" do
    expect(configuration.respond_to? :name).to eq true
  end

  it "responds to :source" do
    expect(configuration.respond_to? :source).to eq true
  end

  it "responds to :multiple" do
    expect(configuration.respond_to? :multiple).to eq true
  end
end
