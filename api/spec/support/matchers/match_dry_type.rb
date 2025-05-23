# frozen_string_literal: true

module MatcherHelpers
  DRY_TYPE = Types.Instance(Dry::Types::Type)
end

RSpec::Matchers.define :match_dry_type do |expected|
  match do |actual|
    raise "Expected #{expected.inspect} to be a dry-type" unless MatcherHelpers::DRY_TYPE.valid?(expected)

    expected.valid? actual
  end

  failure_message do |actual|
    "expected #{actual} to conform to #{expected.inspect}"
  end

  description do
    "Checks that a given value conforms to a dry-type"
  end
end
