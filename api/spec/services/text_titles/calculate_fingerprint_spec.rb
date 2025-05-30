# frozen_string_literal: true

require "rails_helper"

RSpec.describe TextTitles::CalculateFingerprint, fingerprint_calculation: true, interaction: true do
  let_input!(:text_title) { FactoryBot.create :text_title }

  it_behaves_like "a fingerprint interaction"
end
