# frozen_string_literal: true

require "rails_helper"

RSpec.describe Texts::CalculateFingerprint, fingerprint_calculation: true, interaction: true do
  let_input!(:text) { FactoryBot.create :text }

  it_behaves_like "a fingerprint interaction"
end
