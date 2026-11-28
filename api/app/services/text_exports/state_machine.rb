# frozen_string_literal: true

module TextExports
  # State machine for {TextExport}.
  #
  # @see TextExportTransition
  class StateMachine
    include Statesman::Machine
    include Statesman::Events

    state :pending, initial: true
    state :processing
    state :success
    state :failure

    transition from: :pending, to: %i[processing failure]
    transition from: :processing, to: %i[success failure]
    transition from: :failure, to: :pending
    transition from: :success, to: :pending
  end
end
