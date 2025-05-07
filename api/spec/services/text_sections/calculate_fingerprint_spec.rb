# frozen_string_literal: true

require "rails_helper"

RSpec.describe TextSections::CalculateFingerprint, fingerprint_calculation: true, interaction: true do
  let_input!(:text_section) { FactoryBot.create :text_section }

  it_behaves_like "a fingerprint interaction"
end
