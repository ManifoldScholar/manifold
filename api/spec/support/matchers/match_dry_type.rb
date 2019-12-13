RSpec::Matchers.define :match_dry_type do |expected|
  DRY_TYPE = Types.Instance(Dry::Types::Type)

  match do |actual|
    raise "Expected #{expected.inspect} to be a dry-type" unless DRY_TYPE.valid?(expected)

    expected.valid? actual
  end

  failure_message do |actual|
    "expected #{actual} to conform to #{expected.inspect}"
  end

  description do
    "Checks that a given value conforms to a dry-type"
  end
end
