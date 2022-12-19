# frozen_string_literal: true

# @see EntitlementImport
# @see EntitlementImports::StateMachine
class EntitlementImportTransition < ApplicationRecord
  belongs_to :entitlement_import, inverse_of: :transitions

  after_destroy :update_most_recent!, if: :most_recent?

  private

  # @return [void]
  def update_most_recent!
    # :nocov:
    last_transition = entitlement_import.transitions.order(:sort_key).last

    return unless last_transition.present?

    last_transition.update_column(:most_recent, true)
    # :nocov:
  end
end
