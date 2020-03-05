require "rails_helper"

RSpec.describe Entitlements::CheckExpiration, interaction: true do
  let!(:expired_entitlement) { FactoryBot.create :entitlement, :global_subscriber }

  before do
    expired_entitlement.update_column :expires_on, Date.current.yesterday
  end

  it "detects the changed state" do
    perform_within_expectation! do |e|
      e.to change { expired_entitlement.reload.current_state.to_sym }.from(:active).to(:expired)
    end
  end
end
