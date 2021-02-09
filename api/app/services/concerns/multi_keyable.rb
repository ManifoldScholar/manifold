module MultiKeyable
  extend ActiveSupport::Concern

  include ActiveSupport::Configurable

  included do
    config_accessor :multi_keyable_evaluator, instance_writer: false
  end

  def has_multi_keyable_evaluator?
    multi_keyable_evaluator.is_a?(MultiKeyable::Evaluator)
  end

  # @see MultiKeyable::Evaluator#call
  # @return [<Object>]
  def multi_keyable_keys
    raise MultiKeyable::Undefined, "Must define keys via #{self.class}.multi_keyable" unless has_multi_keyable_evaluator?

    multi_keyable_evaluator.call self
  end

  def to_multi_keyable_map(other = nil)
    MultiKeyable::Map.from(self) | MultiKeyable::Map.from(other)
  end

  def to_multi_keyable_hash
    multi_keyable_keys.each_with_object({}) do |key, h|
      h[key] = self
    end
  end

  module ClassMethods
    def multi_keyable(*args, **options, &block)
      config.multi_keyable_evaluator = MultiKeyable::Evaluator.new(args.flatten, **options, eval_block: block)
    end
  end

  # @api private
  class Evaluator
    include Dry::Initializer.define -> do
      param :method_names, Types.Array(Types::Coercible::Symbol), default: proc { [] }

      option :eval_block, Types.Interface(:call).optional, optional: true

      option :flatten_arrays, Types::Bool, default: proc { true }
      option :flatten_models, Types::Bool, default: proc { true }
    end

    MODELISH = Types.Instance(Utility::ModelProxy) | Types::Model

    # @param [Object] object
    # @return [<Object>]
    def call(object)
      method_name_results_for(object) | evaluated_results_for(object)
    end

    private

    # @param [Object] object
    # @return [<Object>]
    def evaluated_results_for(object)
      return [] unless eval_block.respond_to?(:call)

      evaluated_result = object.instance_eval(&eval_block)

      merge_into! [], evaluated_result
    end

    # @param [Object] object
    # @return [<Object>]
    def method_name_results_for(object)
      return [] unless method_names.any?

      method_names.each_with_object([]) do |method_name, results|
        raise MultiKeyable::MissingMethod unless object.respond_to?(method_name)

        result = object.public_send(method_name)

        merge_into! results, result
      end
    end

    # @return [Array]
    def merge_into!(results, result)
      return if result.blank?

      if flatten_models && MODELISH.valid?(result)
        results.concat flatten_model_name(result.model_name)
      elsif flatten_arrays && result.is_a?(Array)
        result.flatten.each do |res|
          merge_into! results, res
        end
      else
        results << result
      end
    end

    def flatten_model_name(model_name)
      [
        model_name.collection.camelize(:lower),
        model_name.collection,
        model_name.singular.camelize(:lower),
        model_name.singular,
        model_name.name
      ].uniq
    end
  end

  # @api private
  class Map
    include Dry::Initializer.define -> do
      param :items, ::Types.Array(::Types.Instance(MultiKeyable)), default: proc { [] }
    end

    include Enumerable

    delegate :blank?, :each, to: :items
    delegate :has_key?, to: :mapping

    attr_reader :mapping

    def initialize(*)
      super

      @mapping = items.reduce({}.with_indifferent_access) do |acc, item|
        acc.merge(item.to_multi_keyable_hash) do |key, a, b|
          raise MultiKeyable::Conflict, "#{a.inspect} and #{b.inspect} both key as #{key}"
        end
      end
    end

    def [](needle)
      case needle
      when Types::Model
        mapping.fetch needle.model_name.name do
          mapping[needle]
        end
      when String, Symbol
        mapping[needle]
      end
    end

    def dig(init = nil, *needles)
      needles.reduce self[init] do |res, needle|
        res[needle] if res.respond_to?(:[])
      end
    end

    def fetch(needle, &block)
      case needle
      when Types::Model
        mapping.fetch(needle.model_name.name) do
          mapping.fetch(needle, &block)
        end
      when String, Symbol
        mapping.fetch(needle, &block)
      end
    end

    def |(other)
      raise TypeError, "Expected MultiKeyableMap: #{other.inspect}" unless other.is_a?(MultiKeyable::Map)

      new_items = items | other.items

      self.class.new new_items
    end

    def to_multi_keyable_map(other = nil)
      self | MultiKeyable::Map.from(other)
    end

    class << self
      def from(value)
        case value
        when MultiKeyable::Map then value
        when MultiKeyable then new([value])
        when Types.Array(Types.Instance(MultiKeyable)) then new(value)
        when nil then new []
        else
          # :nocov:
          raise TypeError, "Don't know how to get MultiKeyable::Map from #{value.inspect}"
          # :nocov:
        end
      end
    end
  end

  # Raised when creating a map with conflicting keys
  class Conflict < KeyError; end

  # Raised when evaluating an object for a method that it doesn't respond to.
  class MissingMethod < TypeError; end

  # Raised when trying to get keys without an evaluator
  class Undefined < TypeError; end
end
