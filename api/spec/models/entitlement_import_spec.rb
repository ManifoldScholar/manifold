# frozen_string_literal: true

require "rails_helper"

RSpec.describe EntitlementImport, type: :model do
  let!(:import) { FactoryBot.create :entitlement_import }

  it "is expected to be in a pending state by default" do
    expect(import).to be_in_state :pending
  end
end
