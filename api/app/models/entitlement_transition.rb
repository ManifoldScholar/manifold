class EntitlementTransition < ApplicationRecord
  belongs_to :entitlement, inverse_of: :transitions

  after_destroy :update_most_recent!, if: :most_recent?

  private

  # @return [void]
  def update_most_recent!
    # :nocov:
    last_transition = entitlement.transitions.order(:sort_key).last

    return unless last_transition.present?

    last_transition.update_column(:most_recent, true)
    # :nocov:
  end
end
