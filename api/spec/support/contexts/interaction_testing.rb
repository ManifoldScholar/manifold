RSpec.shared_context "interaction testing" do
  let(:interaction_inputs) do
    {}.with_indifferent_access
  end
end

module InteractionTesting
  module ExampleHelpers
    def perform_the_interaction!(**inputs)
      described_class.run interaction_inputs.merge(inputs)
    end

    def perform_within_expectation!(valid: true, **inputs)
      block_expectation = expect do
        @outcome = perform_the_interaction! valid: valid, **inputs
      end

      unless block_given?
        block_expectation.not_to raise_error
      else
        yield block_expectation
      end

      expect(@outcome).to valid ? be_valid : be_invalid

      test_outcome(@outcome, valid: valid, **inputs)

      return @outcome
    end

    def test_outcome(outcome, valid: true, **inputs)
      # purposely blank
    end
  end
end

RSpec.configure do |config|
  config.include_context "interaction testing", interaction: true
  config.include InteractionTesting::ExampleHelpers, interaction: true
end
