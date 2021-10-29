module ProjectExportations
  # State machine for {ProjectExportation}.
  #
  # @see ProjectExportationTransition
  class StateMachine
    include Statesman::Machine
    include Statesman::Events

    state :pending, initial: true
    state :export_ready
    state :success
    state :failure

    transition from: :pending, to: %i[export_ready failure]
    transition from: :export_ready, to: %i[success failure]
    transition from: :failure, to: :pending

    after_transition to: :success do |exportation|
      exportation.touch :exported_at
    end
  end
end
