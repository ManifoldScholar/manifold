# frozen_string_literal: true

# @see PendingEntitlement
# @see PendingEntitlements::StateMachine
class PendingEntitlementTransition < ApplicationRecord
  belongs_to :pending_entitlement, inverse_of: :transitions

  after_destroy :update_most_recent!, if: :most_recent?

  private

  # @return [void]
  def update_most_recent!
    # :nocov:
    last_transition = pending_entitlement.transitions.order(:sort_key).last

    return if last_transition.blank?

    last_transition.update_column(:most_recent, true)
    # :nocov:
  end
end
