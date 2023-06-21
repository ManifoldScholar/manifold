# This allows us to create a `dry-container` that has a little less boilerplate.
module IntrospectiveContainer
  extend ActiveSupport::Concern

  included do
    extend Dry::Core::Container::Mixin
  end

  module ClassMethods
    # @!attribute [r] inflector
    # @!scope class
    # @return [Dry::Inflector]
    def inflector
      @inflector ||= build_inflector
    end

    # Simple wrapper around registering callable objects.
    #
    # @example Usage
    #   register_simple_callables :bar, baz: "quux"
    #
    #   # Equivalent to
    #
    #   register :bar do
    #     Parent::Foo::Bar.new
    #   end
    #
    #   register :baz do
    #     Parent::Foo::Quux.new
    #   end
    #
    # @param [<#to_s>] klasses
    # @param [Boolean] memoize
    # @param [{ #to_s => #to_s }] pairs
    def register_simple_callables(*klasses, memoize: true, **pairs)
      mapping = simple_registry_mapping(klasses: klasses, pairs: pairs)

      mapping.each do |registry_key, klass_name|
        register registry_key, memoize: memoize do
          klass_name.constantize.new
        end
      end
    end

    # Simple wrapper around registering callable objects in a given `namespace`.
    #
    # @example Usage
    #   register_simple_callables_in :foo, :bar, baz: "quux"
    #
    #   # Equivalent to
    #
    #   namespace :foo do
    #     register :bar do
    #       Parent::Foo::Bar.new
    #     end
    #
    #     register :baz do
    #       Parent::Foo::Quux.new
    #     end
    #   end
    #
    # @param [#to_s] namespace
    # @param [Boolean] memoize
    # @param [<#to_s>] klasses
    # @param [{ #to_s => #to_s }] pairs
    def register_simple_callables_in(namespace, *klasses, memoize: true, **pairs)
      mapping = simple_registry_mapping(klasses: klasses, pairs: pairs, namespace: namespace)

      self.namespace namespace.to_s do
        mapping.each do |registry_key, klass_name|
          register registry_key, memoize: memoize do
            klass_name.constantize.new
          end
        end

        instance_eval(&Proc.new) if block_given?
      end
    end

    # @return [Module]
    def root_namespace
      module_parent
    end

    private

    # @param [<#to_s>] klasses
    # @param [{ #to_s => #to_s }] pairs
    # @param [#to_s] namespace
    def simple_registry_mapping(klasses: [], pairs: {}, namespace: nil)
      klasses.zip(klasses).to_h.with_indifferent_access.merge(pairs).transform_values do |klass_name|
        subpath = inflector.camelize([namespace, klass_name].compact.join("/"))

        "#{root_namespace}::#{subpath}"
      end
    end

    def build_inflector
      Dry::Inflector.new do |inflections|
        inflections.acronym "HTML"
      end
    end
  end
end
