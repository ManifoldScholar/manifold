# frozen_string_literal: true

# Helpers for defining certain types of associations.
module AssociationHelpers
  extend ActiveSupport::Concern

  class_methods do
    # Define a read-only `belongs_to` association
    #
    # @param [Symbol] name
    # @param [<Object>] args
    # @param [{ Symbol => Object }] kwargs
    # @yield Set up the belongs_to association
    # @yieldreturn [void]
    # @!macro [attach] belongs_to_readonly
    #   @!parse ruby
    #     # @note This association is read-only (likely against a database view).
    #     belongs_to $1, -> { readonly }, ${2--1}
    def belongs_to_readonly(name, *args, **kwargs, &)
      belongs_to(name, *args, **kwargs, &)
    end

    # Define a read-only `has_many` association.
    #
    # @param [Symbol] name
    # @param [<Object>] args
    # @param [{ Symbol => Object }] kwargs
    # @yield Set up the has_many association
    # @yieldreturn [void]
    # @!macro [attach] has_many_readonly
    #   @!parse ruby
    #     # @note This association is read-only (likely against a database view).
    #     has_many $1, -> { readonly }, ${2--1}
    def has_many_readonly(name, *args, **kwargs, &)
      has_many(name, *args, **kwargs, &) # rubocop:disable Rails/HasManyOrHasOneDependent
    end

    # Define a read-only `has_one` association
    #
    # @param [Symbol] name
    # @param [<Object>] args
    # @param [{ Symbol => Object }] kwargs
    # @yield Set up the has_one association
    # @yieldreturn [void]
    # @!macro [attach] has_one_readonly
    #   @!parse ruby
    #     # @note This association is read-only (likely against a database view).
    #     has_one $1, -> { readonly }, ${2--1}
    def has_one_readonly(name, *args, **kwargs, &)
      has_one(name, *args, **kwargs, &) # rubocop:disable Rails/HasManyOrHasOneDependent
    end
  end
end
