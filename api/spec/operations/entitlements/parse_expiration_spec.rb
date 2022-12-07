# frozen_string_literal: true

require "rails_helper"

RSpec.describe Entitlements::ParseExpiration, type: :operation do
  let(:operation) { described_class.new }

  it "can parse a variety of inputs" do
    aggregate_failures do
      expect(operation.call("1 year from now")).to succeed.with(1.year.from_now.to_date)
      expect(operation.call("2040/01/01")).to succeed.with(Date.new(2040, 1, 1))
      expect(operation.call("foo")).to monad_fail.with_key(:invalid)
      expect(operation.call("1900/01/01")).to monad_fail.with_key(:past)
    end
  end
end
