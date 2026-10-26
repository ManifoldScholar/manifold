# frozen_string_literal: true

module LtiRegistrations
  # @see LtiRegistration
  # @see LtiRegistrationState
  #
  # A platform is untrusted until an admin approves it.
  class StateMachine
    include Statesman::Machine

    state :pending, initial: true
    state :approved
    state :denied
    state :blocked

    transition from: :pending,  to: %i[approved denied blocked]
    transition from: :approved, to: %i[denied blocked]
    transition from: :denied,   to: %i[approved blocked]
    transition from: :blocked,  to: %i[approved denied]
  end
end
