require "rails_helper"

RSpec.describe Collaborators::CalculateFingerprint, fingerprint_calculation: true, interaction: true do
  let_input!(:collaborator) { FactoryBot.create :collaborator }

  it_behaves_like "a fingerprint interaction"
end
