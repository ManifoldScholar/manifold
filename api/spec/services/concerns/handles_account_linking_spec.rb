# frozen_string_literal: true

require "rails_helper"

RSpec.describe HandlesAccountLinking do
  subject(:linking) { Class.new { include HandlesAccountLinking }.new }

  describe "#account_linking_required_for?" do
    it "requires ownership proof for LTI" do
      expect(linking.account_linking_required_for?("lti")).to be(true)
    end

    it "does not require it for other providers (opt-in comes later)" do
      expect(linking.account_linking_required_for?("google_oauth2")).to be(false)
      expect(linking.account_linking_required_for?("facebook")).to be(false)
    end
  end
end
