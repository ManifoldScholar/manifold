# frozen_string_literal: true

# @see EntitlementImportRow
# @see EntitlementImportRows::StateMachine
class EntitlementImportRowTransition < ApplicationRecord
  belongs_to :entitlement_import_row, inverse_of: :transitions

  after_destroy :update_most_recent!, if: :most_recent?

  private

  # @return [void]
  def update_most_recent!
    # :nocov:
    last_transition = entitlement_import_row.transitions.order(:sort_key).last

    return unless last_transition.present?

    last_transition.update_column(:most_recent, true)
    # :nocov:
  end
end
