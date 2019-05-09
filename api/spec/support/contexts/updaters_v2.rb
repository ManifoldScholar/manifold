RSpec.shared_context "updaters v2" do
  let(:interaction_inputs) do
    build_interaction_inputs
  end

  let(:model) { nil }
  let(:creator) { nil }
  let(:attributes) { Hash.new }
  let(:relationships) { Hash.new }
end

module UpdatersV2Testing
  module ExampleHelpers
    include InteractionTesting::ExampleHelpers

    def attachment_map(filename, data_uri)
      { filename: filename, data: data_uri }
    end

    def build_interaction_inputs(**other_inputs)
      {}.with_indifferent_access
        .merge(default_interaction_inputs)
        .merge(attributes)
        .merge(other_inputs)
    end

    def default_interaction_inputs
      {
        creator: creator,
        model: model,
        relationships: relationships
      }.with_indifferent_access
    end
  end
end

RSpec.configure do |config|
  config.include_context "interaction testing", updaters_v2: true
  config.include_context "data uri", updaters_v2: true
  config.include_context "updaters v2", updaters_v2: true
  config.include UpdatersV2Testing::ExampleHelpers, updaters_v2: true
end
