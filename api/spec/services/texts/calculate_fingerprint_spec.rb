require "rails_helper"

RSpec.describe Texts::CalculateFingerprint, fingerprint_calculation: true, interaction: true do
  let_input!(:text) { FactoryBot.create :text }

  it_should_behave_like "a fingerprint interaction"
end
