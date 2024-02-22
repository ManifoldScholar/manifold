# frozen_string_literal: true

RSpec::Matchers.define :have_an_error_of_type do |expected|
  match do
    actual.validate

    actual.errors.any? do |error|
      expected === error.type
    end
  end
end
