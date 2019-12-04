RSpec.shared_context 'interaction testing' do
  let(:interaction_inputs) do
    build_interaction_inputs
  end

  let(:valid_outcome) do
    double("valid interaction", :invalid? => false, :valid? => true, result: valid_outcome_result)
  end

  let(:valid_outcome_result) do
    nil
  end
end

module InteractionTesting
  module ExampleHelpers
    def build_interaction_inputs
      self.class.interaction_input_keys.transform_values do |method_name|
        read_interaction_input_value_for method_name
      end
    end

    def read_interaction_input_value_for(method_name)
      __send__(method_name)
    end

    def perform_the_interaction!(**inputs)
      described_class.run interaction_inputs.merge(inputs)
    end

    def perform_within_expectation!(valid: true, raises: false, **inputs)
      block_expectation = expect do
        @outcome = perform_the_interaction! valid: valid, raises: raises, **inputs

        if (valid || raises) && @outcome.present? && @outcome.errors.any?
          raise StandardError, @outcome.flattened_errors(prefix: "Unexpected errors")
        end
      end

      unless block_given?
        case raises
        when Exception
          block_expectation.to raise_error(raises)
        when Array
          block_expectation.to raise_error(*raises)
        when true
          block_expectation.to raise_error
        else
          block_expectation.not_to raise_error
        end
      else
        yield block_expectation
      end

      unless raises
        expect(@outcome).to valid ? be_valid : be_invalid

        test_outcome(@outcome, valid: valid, **inputs)
      end

      return @outcome
    end

    def test_outcome(outcome, valid: true, **inputs)
      # purposely blank
    end
  end

  module SpecHelpers
    def include_input!(name, key: name)
      interaction_input_keys[key] = name
    end

    def remove_input!(key)
      interaction_input_keys.delete(key)
    end

    def interaction_input_keys
      @interaction_input_keys ||= superclass.respond_to?(:interaction_input_keys) ? superclass.interaction_input_keys.deep_dup : {}.with_indifferent_access
    end

    def let_input(name, key: name, &block)
      let(name, &block)

      include_input! name, key: key
    end

    def let_input!(name, key: name, &block)
      let!(name, &block)

      include_input! name, key: key
    end
  end
end

RSpec.configure do |config|
  config.include_context 'interaction testing', interaction: true
  config.include InteractionTesting::ExampleHelpers, interaction: true
  config.extend InteractionTesting::SpecHelpers, interaction: true
end
