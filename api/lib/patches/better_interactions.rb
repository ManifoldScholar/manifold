module Patches
  # Allows ActiveModel error messages to be flattened into a single string
  module FlattenedErrors
    DEFAULT_FLATTENED_ERROR = "Something went wrong".freeze

    # @return [String]
    def flattened_errors(default: DEFAULT_FLATTENED_ERROR, prefix: "")
      flatten_errors_for self, default: default
    end

    # @param [ActiveModel::Validations] object
    # @return [String]
    def flatten_errors_for(object, default: DEFAULT_FLATTENED_ERROR, prefix: "")
      message = object.errors.full_messages.to_sentence.upcase_first.presence || default

      [prefix, message].map(&:presence).compact.join(": ")
    end

    module_function :flatten_errors_for
  end

  # Exposes class-level configurations for various interaction concerns
  module ConfigurableInteraction
    extend ActiveSupport::Concern

    included do
      include ActiveSupport::Configurable

      config_accessor :configurable_attrs

      self.configurable_attrs = []
    end

    class_methods do
      # @param [Symbol] name
      # @param [Object] default
      # @param [Boolean] delegates
      # @param [Boolean] predicate
      # @return [void]
      def configurable_attr(name, default = nil, delegates: true, predicate: false)
        name = name.to_sym

        self.configurable_attrs |= [name]

        config_accessor name

        __send__ "#{name}=", default

        if delegates
          delegate name, to: :class

          if predicate
            class_eval <<~RUBY, __FILE__, __LINE__ + 1
              def self.#{name}?
                self.#{name}.present?
              end
               def #{name}?
                self.class.#{name}.present?
              end
            RUBY
          end
        end
      end
    end
  end

  # Methods that can isolate an interaction within a single transaction, and provide easy
  # short-circuiting.
  module IsolatableInteraction
    extend ActiveSupport::Concern

    include Patches::ConfigurableInteraction
    include Patches::FlattenedErrors

    included do
      configurable_attr :watches_for_halt, false, predicate: true
      configurable_attr :wrap_in_transaction, false, predicate: true
      configurable_attr :always_start_new_transaction, false, predicate: true

      set_callback :validate, :around, :catch_halt!, if: :watches_for_halt?

      set_callback :execute, :around, :in_transaction, if: :wrap_in_transaction?
      set_callback :execute, :around, :catch_halt!, if: :watches_for_halt?

      delegate :transactor_klass, to: :class
    end

    # Used to differentiate `nil` as a valid `on_success` argument.
    NO_ARG = Dux.null("No Argument Passed").freeze

    # @api private
    # @return [void]
    def catch_halt!
      catch :halt! do
        yield if block_given?
      end
    end

    def compose(interaction, provided_inputs = {})
      super
    rescue ActiveInteraction::Interrupt => e
      raise ActiveRecord::Rollback, e.errors if in_transaction?

      raise e
    end

    def safe_compose(interaction, provided_inputs = {}, halt_on_invalid: true, merge_errors_if_yielded: false, **other_inputs)
      outcome = interaction.run(provided_inputs.with_indifferent_access.merge(other_inputs))

      if outcome.invalid?
        errors.merge! outcome.errors if (block_given? && merge_errors_if_yielded) || !block_given?

        yield outcome if block_given?

        halt! if halt_on_invalid

        return nil
      end

      outcome.result
    end

    # @param [ApplicationRecord, ActiveModel::Validations, #destroy] model
    # @return [void]
    def destroy_model!(model)
      unless model.destroy
        failure_reason = flatten_errors_for(model).presence || "Unable to destroy model"

        halt! failure_reason
      end

      model
    end

    # @param [String] reason
    # @return [void]
    def halt!(reason = nil)
      errors.add :base, reason if reason.present?

      @_interaction_valid = errors.none?

      throw :halt!
    end

    # @param [ApplicationRecord, ActiveModel::Validations] model
    # @return [ApplicationRecord]
    def halt_on_invalid!(model)
      halt! flatten_errors_for(model) unless model.valid?

      model
    end

    # @param [ActiveRecord::Base] model
    # @param [Boolean] assimilate
    # @param [Symbol, nil] save_context
    def persist_model!(model, assimilate: false, save_context: nil)
      save_options = {}.tap do |h|
        h[:context] = save_context if save_context.present?
      end
      return model if model.save(save_options)

      absorb_model_errors!(model, assimilate: assimilate, save_context: save_context)
    end

    # @param [ActiveRecord::Base] model
    # @param [Boolean] assimilate
    # @param [Symbol, nil] save_context
    # @return [void]
    def absorb_model_errors!(model, assimilate: false, save_context: nil)
      if assimilate
        assimilate_errors!(model)

        if errors.none?
          halt! "Model failed to save"
        else
          halt!
        end
      else
        halt! flatten_errors_for(model)
      end
    end

    # @!group Statesman Methods

    # Ensure that a given model can attempt to transition to a new state.
    #
    # @param [Symbol] target_state the name of the Statesman target_state
    # @param [ApplicationRecord, Symbol] on the model or input to check the target_state availability
    # @param [Symbol] error
    # @param [{ Symbol => Object }] options
    # @option options [Symbol, nil] guard_target
    # @return [Boolean]
    def ensure_transitionable!(target_state, on:, error: :cannot_transition, **options)
      model = on.is_a?(Symbol) ? __send__(on) : on

      return true if model.can_transition_to? target_state

      guard_target = options.fetch :guard_target do
        on.is_a?(Symbol) ? on : error_target_for(model, default: :base)
      end

      errors.add guard_target, error, target_state: target_state

      halt!
    end

    # Try to transition a `Statesman` target_state on a given model or input / attribute.
    #
    # @see #ensure_transitionable!
    # @param [Symbol] target_state the name of the Statesman target_state
    # @param [ApplicationRecord, Symbol] on the model or input that should have a transitioned target_state
    # @param [Boolean] check_if_transitionable determines if {#ensure_transitionable!} should be called
    # @param [Symbol] error The i18n message key to use
    # @param [Symbol] guard_error The error symbol that will be passed to {#ensure_transitionable!}, if it is called
    # @param [Hash] metadata
    # @param [{ Symbol => Object }] options
    # @option options [Symbol, nil] error_target
    # @option options [Symbol, nil] guard_target
    # @return [Boolean]
    # rubocop:disable Metrics/CyclomaticComplexity, Metrics/ParameterLists
    def transition_to!(target_state, on:, assimilate: false, check_if_transitionable: true, error: :something_went_wrong, guard_error: :cannot_transition, metadata: {}, **options)
      model = on.is_a?(Symbol) ? __send__(on) : on

      ensure_transitionable!(target_state, on: on, error: guard_error, **options) if check_if_transitionable

      return model if model.transition_to target_state, metadata

      error_target = options.fetch :error_target do
        on.is_a?(Symbol) && error != :something_went_wrong ? on : :base
      end

      if assimilate && model.errors.any?
        assimilate_errors! model
      else
        errors.add error_target, error
      end

      halt!
    end
    # rubocop:enable Metrics/CyclomaticComplexity, Metrics/ParameterLists

    # Ensure that a given model can attempt to trigger an event, purely based on its current state.
    #
    # @param [Symbol] event the name of the Statesman event
    # @param [ApplicationRecord, Symbol] on the model or input to check the event availability
    # @param [Symbol] error
    # @param [{ Symbol => Object }] options
    # @option options [Symbol, nil] guard_target
    # @return [Boolean]
    def ensure_triggerable!(event, on:, error: :cannot_trigger, **options)
      model = on.is_a?(Symbol) ? __send__(on) : on

      return true if model.can_trigger? event

      guard_target = options.fetch :guard_target do
        on.is_a?(Symbol) ? on : error_target_for(model, default: :base)
      end

      errors.add guard_target, error, event: event

      halt!
    end

    # Try to trigger a `Statesman` event on a given model or input / attribute.
    #
    # @see #ensure_triggerable!
    # @param [Symbol] event the name of the Statesman event
    # @param [ApplicationRecord, Symbol] on the model or input that should have a triggered event
    # @param [Boolean] check_if_triggerable determines if {#ensure_triggerable!} should be called
    # @param [Symbol] error The i18n message key to use
    # @param [Symbol] guard_error The error symbol that will be passed to {#ensure_triggerable!}, if it is called
    # @param [{ Symbol => Object }] options
    # @option options [Symbol, nil] error_target
    # @option options [Symbol, nil] guard_target
    # @return [Boolean]
    # rubocop:disable Metrics/CyclomaticComplexity, Metrics/ParameterLists
    def trigger!(event, on:, assimilate: false, check_if_triggerable: true, error: :something_went_wrong, guard_error: :cannot_trigger, **options)
      model = on.is_a?(Symbol) ? __send__(on) : on

      ensure_triggerable!(event, on: on, error: guard_error, **options) if check_if_triggerable

      return model if model.trigger event

      error_target = options.fetch :error_target do
        on.is_a?(Symbol) && error != :something_went_wrong ? on : :base
      end

      if assimilate && model.errors.any?
        assimilate_errors! model
      else
        errors.add error_target, error
      end

      halt!
    end
    # rubocop:enable Metrics/CyclomaticComplexity, Metrics/ParameterLists

    # @!endgroup

    # @api private
    # @param [ApplicationRecord]
    # @return [void]
    def assimilate_errors!(model)
      return unless model.errors.any?

      model.errors.each do |error|
        attribute = error.attribute
        message = error.message

        if input?(attribute)
          errors.add attribute, message
        else
          errors.add :base, model.errors.full_message(attribute, message)
        end
      end
    end

    # @api private
    # @param [#model_name, ApplicationRecord]
    # @return [Symbol]
    def error_target_for(model, default: :base)
      key = model&.model_name&.i18n_key

      key && input?(key.to_sym) ? key : default
    end

    # @api private
    # @return [ActiveRecord::WrappedTransaction::Result]
    def in_transaction_with_result(start_new: always_start_new_transaction?, &block)
      transactor_klass.wrapped_transaction(joinable: !start_new, requires_new: start_new, &block)
    end

    # @api private
    # @param [Object] on_success We use {NO_ARG} here to differentiate vs `nil`.
    # @yield The execution method for this interaction
    # @return [Object]
    def in_transaction(on_success: NO_ARG, on_failure: :halt, &block)
      txn_result = in_transaction_with_result(&block)

      if txn_result.success?
        on_success.eql?(NO_ARG) ? txn_result.result : on_success
      elsif on_failure == :halt
        handle_failed_transaction! txn_result
      else
        on_failure
      end
    end

    def in_transaction?
      transactor_klass.connection.open_transactions > 0
    end

    def rollback!
      raise ActiveRecord::Rollback
    end

    private

    def handle_failed_transaction!(transaction_result)
      return false if errors.any?

      error = transaction_result.error

      interrupt = extract_interrupt_from error

      if interrupt&.errors&.any?
        errors.merge! interrupt.errors
      elsif error.present?
        errors.add :base, "Error caused rollback: #{error.inspect}"
      else
        errors.add :base, "Uncaught rollback"
      end

      false
    end

    def extract_interrupt_from(exception)
      loop do
        break exception if exception.nil? || exception.is_a?(ActiveInteraction::Interrupt)

        exception = exception.cause
      end
    end

    class_methods do
      # Specify that this interaction should always started a new transaction
      # rather than simply joining its parent (if any).
      #
      # @return [void]
      def always_start_new_transaction!(value = true)
        self.always_start_new_transaction = value
      end

      # Make an interaction easily haltable.
      #
      # @return [void]
      def haltable!
        self.watches_for_halt = true
      end

      # Specify that the interaction should run in a transaction.
      #
      # @see .haltable implies that the interaction can be halted
      #
      # @return [void]
      def transactional!
        haltable!

        self.wrap_in_transaction = true
      end

      # @api private
      # @note Must respond to `wrapped_transaction`.
      # @return [Class]
      def transactor_klass
        ActiveRecord::Base
      end
    end
  end

  # Modify interactions to be a bit more flexible in how they accept inputs.
  #
  # This allows us to pass a variadic amount of hashes to the initialize method
  # and have them be merged.
  #
  # This also adds an `initialize` callback for processing that happens before,
  # after, or around the interaction's initialization.
  module BetterInteractions
    IS_TO_H = Dux[:to_h]
    IS_TO_HASH = Dux[:to_hash]

    def self.prepended(mod)
      mod.class_eval do
        define_callbacks :initialize
      end

      mod.include Patches::FlattenedErrors
      mod.singleton_class.prepend Patches::BetterInteractions::ClassMethods
    end

    # @param [<Hash>] extra_inputs
    # @param [{ Symbol => Object }] authoritative_inputs
    def initialize(*extra_inputs, **authoritative_inputs)
      run_callbacks :initialize do
        inputs = merge_inputs(*extra_inputs, **authoritative_inputs)

        super(inputs)
      end
    end

    def input?(key)
      self.class.filters.key? key
    end

    private

    # @param [<ActionController::Parameters, Hash, #to_h, #to_hash>] extra_inputs
    # @param [{ Symbol => Object }] authoritative_inputs
    # @return [ActiveSupport::HashWithIndifferentAccess]
    def merge_inputs(*extra_inputs, **authoritative_inputs)
      extra_inputs.flatten!

      return authoritative_inputs if extra_inputs.blank?

      merged = extra_inputs.reduce({}.with_indifferent_access) do |inputs, extra_input|
        inputs.merge(normalize_extra_input(extra_input))
      end.merge(authoritative_inputs).symbolize_keys

      # Handle the case where params are passed to hash inputs
      merged.transform_values do |value|
        if value.is_a?(ActionController::Parameters)
          value.to_unsafe_h
        else
          value
        end
      end
    end

    # @param [ActionController::Parameters, Hash, #to_h, #to_hash] input
    # @return [Hash]
    def normalize_extra_input(input)
      case input
      when ActionController::Parameters then input.to_unsafe_h
      when Hash then input
      when IS_TO_H then input.to_h
      when IS_TO_HASH then input.to_hash
      else
        raise TypeError, "expected #{input.inspect} to be some sort of hash-like"
      end
    end

    module ClassMethods
      # @return [void]
      def configurable!
        include Patches::ConfigurableInteraction
      end

      # @return [void]
      def isolatable!
        include Patches::ConfigurableInteraction
        include Patches::IsolatableInteraction
      end
    end
  end
end

ActiveInteraction::Base.prepend Patches::BetterInteractions

# We want to be able to refer to this in our subclasses
ActiveInteraction.public_constant :Interrupt

# Transactions need to be wrappable
ActiveRecord::Base.include ActiveRecord::WrappedTransaction

# ActiveRecord models should also be able to flatten their errors.
ActiveRecord::Base.include Patches::FlattenedErrors
