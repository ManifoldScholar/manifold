# An idiomatic concern that composes ClassyEnum with Statesman in a standard way.
#
# rubocop:disable Layout/LineLength, Naming/PredicateName
module HasStateMachine
  extend ActiveSupport::Concern

  include ActiveSupport::Configurable
  include HasReloadHooks

  included do
    delegate :can_transition_to?, :in_state?, :transition_to, :transition_to!, :trigger, :trigger!, :available_events, to: :state_machine
  end

  def can_trigger?(event_name)
    event_name.to_sym.in? available_events
  end

  # @api private
  # @return [void]
  def clear_current_state!
    clear_state_machine!

    safe_remove_instance_variable :@current_state
  end

  # @api private
  # @return [void]
  def clear_state_machine!
    safe_remove_instance_variable :@state_machine
  end

  # @abstract
  # @return [ClassyEnum::Base]
  def current_state(*)
    raise NotImplementedError, "Must implement current state method"
  end

  # @abstract
  # @return [Statesman::Machine]
  def state_machine(*)
    raise NotImplementedError, "Must implement a state machine"
  end

  class_methods do
    include Statesman::Adapters::ActiveRecordQueries::ClassMethods

    def has_state_machine!(initial_state:, enum_klass: default_enum_klass, machine_klass: default_machine_klass, transition_klass: default_transition_klass)
      config.initial_state = initial_state
      config.transition_klass = transition_klass

      clear_variables_on_reload! :current_state, :state_machine

      mod = StandardStateMachineMethods.new klass: self, enum_klass: enum_klass, machine_klass: machine_klass, transition_klass: transition_klass

      const_set(:StandardStateMachineMethods, mod)

      include mod

      has_many :transitions, class_name: transition_klass.name, dependent: :destroy, autosave: false, inverse_of: model_name.i18n_key

      delegate *enum_klass.predicates, to: :current_state

      return
    end

    # @api private
    # @return [Class]
    def transition_class
      config.transition_klass or super
    end

    # @api private
    # @return [Symbol]
    def initial_state
      config.initial_state or super
    end

    private

    def default_enum_klass
      "#{name}State".constantize
    end

    def default_machine_klass
      "#{name.pluralize}::StateMachine".constantize
    end

    def default_transition_klass
      "#{name}Transition".constantize
    end
  end

  # @api private
  class StandardStateMachineMethods < Module
    def initialize(klass:, enum_klass:, machine_klass:, transition_klass:)
      @klass = klass
      @enum_klass = enum_klass
      @machine_klass = machine_klass
      @transition_klass = transition_klass

      class_eval <<~RUBY, __FILE__, __LINE__ + 1
        def current_state(force_reload: false)
          if @current_state.blank? || @current_state.to_s != state_machine.current_state(force_reload: force_reload)
            @current_state = #{enum_klass}.build(state_machine.current_state, owner: self)
          end

          return @current_state
        end

        def state_machine
          @state_machine ||= #{machine_klass}.new(self, transition_class: #{transition_klass}, association_name: :transitions)
        end
      RUBY
    end
  end
end
# rubocop:enable Layout/LineLength, Naming/PredicateName
