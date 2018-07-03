require "rails_helper"

shared_examples_for "an ingestion registry" do |definition|
  let(:registry) { described_class.new }

  it "has a generated configurator class" do
    expect(described_class.configurator).to be described_class::Configurator
  end

  it "has a generated definition class" do
    expect(described_class.definition).to be described_class::Definition
  end

  it "has a generated definition configurator class" do
    expect(described_class.definition_configurator).to be described_class::DefinitionConfigurator
  end

  it "adds a definition to the registry" do
    expect do
      registry.configure do
        eval definition
      end
    end.to change{ registry.length }.from(0).to(1)
  end
end
