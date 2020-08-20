# Allows instance variables to be automatically cleared when a model is `#reload`ed.
module HasReloadHooks
  extend ActiveSupport::Concern

  include ActiveSupport::Configurable

  IVAR = Types::Strict::Symbol.constrained(format: /\A@[a-zA-Z_]\w*/)
  IVAR_LIST = Types::Strict::Array.of(IVAR)

  included do
    define_model_callbacks :reload

    before_reload :clear_variables_on_reload!, if: :has_variables_to_clear_on_reload?

    config.variables_to_clear_on_reload = []

    delegate :variables_to_clear_on_reload, to: :class
  end

  def has_variables_to_clear_on_reload?
    variables_to_clear_on_reload.present?
  end

  def reload(*)
    run_callbacks :reload do
      super
    end
  end

  # @api private
  # @return [void]
  def clear_variables_on_reload!
    return unless has_variables_to_clear_on_reload?

    variables_to_clear_on_reload.each do |variable|
      next unless instance_variable_defined?(variable)

      safe_remove_instance_variable variable
    end
  end

  # Safely remove an instance variable (only if it is defined).
  # @param [Symbol] variable
  # @return [void]
  def safe_remove_instance_variable(variable)
    remove_instance_variable(variable) if instance_variable_defined?(variable)
  end

  class_methods do
    # @return [void]
    def clear_variables_on_reload!(*variable_names)
      normalized = normalize_clearable_variable_names(variable_names)

      current = Array(config.variables_to_clear_on_reload)

      config.variables_to_clear_on_reload = IVAR_LIST[current | normalized]
    end

    # @return [<Symbol>]
    def normalize_clearable_variable_names(variable_names)
      variable_names.flatten.map do |variable_name|
        variable_name.to_s.sub(/\A(?!<@)([^@]+)/, '@\1').to_sym
      end
    end

    # @!scope class
    # @!attribute [r] variables_to_clear_on_reload
    # @return [<Symbol>]
    def variables_to_clear_on_reload
      config.variables_to_clear_on_reload
    end
  end
end
