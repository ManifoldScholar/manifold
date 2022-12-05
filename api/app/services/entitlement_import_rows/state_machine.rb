# frozen_string_literal: true

module EntitlementImportRows
  class StateMachine
    include Statesman::Machine
    include Statesman::Events

    state :pending, initial: true
    state :success
    state :failure

    transition from: :pending, to: %i[success failure]
  end
end
