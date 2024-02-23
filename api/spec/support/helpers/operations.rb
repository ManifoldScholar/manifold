# frozen_string_literal: true

module TestHelpers
  module Operations
    # @return [Object]
    def calling_the_operation
      operation.call(*operation_args, **operation_options)
    end

    def expect_calling_the_operation
      expect(calling_the_operation)
    end
  end
end

RSpec.shared_context "operation helpers" do
  include TestHelpers::Operations

  let(:operation) { described_class.new }
  let(:operation_args) { [] }
  let(:operation_options) { {} }
end

RSpec.configure do |config|
  config.include TestHelpers::Operations, type: :operations
  config.include_context "operation helpers", type: :operation
end
