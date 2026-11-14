# frozen_string_literal: true

# @see LtiRegistration
# @see LtiRegistrations::StateMachine
class LtiRegistrationTransition < ApplicationRecord
  belongs_to :lti_registration, inverse_of: :transitions

  after_destroy :update_most_recent!, if: :most_recent?

  private

  # @return [void]
  def update_most_recent!
    # :nocov:
    last_transition = lti_registration.transitions.order(:sort_key).last

    return if last_transition.blank?

    last_transition.update_column(:most_recent, true)
    # :nocov:
  end
end
