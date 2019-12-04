require "rails_helper"

RSpec.describe TextTitles::CalculateFingerprint, fingerprint_calculation: true, interaction: true do
  let_input!(:text_title) { FactoryBot.create :text_title }

  it_should_behave_like "a fingerprint interaction"
end
