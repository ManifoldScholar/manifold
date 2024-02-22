# frozen_string_literal: true

module Utility
  module EnhancedStoreModel
    extend ActiveSupport::Concern

    include Sliceable

    included do
      include StoreModel::Model

      prepend EnhancedBrackets
    end

    delegate :dig, :fetch, to: :indifferent_hash

    # @return [ActiveSupport::HashWithIndifferentAccess]
    def indifferent_hash
      as_json.with_indifferent_access
    end

    # @param [StoreModel::Base, { Symbol => Object }] attrs
    # @return [void]
    def merge!(attrs)
      case attrs
      when self.class
        merge!(attrs.as_json)
      when Hash
        attrs.each do |attr, value|
          self[attr] = value
        end
      end

      return self
    end

    alias safe_assign_attributes merge!

    # This module needs to be prepended _over_ `StoreModel::Model`.
    #
    # @api private
    module EnhancedBrackets
      # @param [#to_s] attr
      # @return [Object]
      def [](attr)
        if has_attribute?(attr)
          super
        else
          unknown_attributes[attr.to_s]
        end
      end

      # @param [#to_s] attr
      # @param [Object] value
      # @return [void]
      def []=(attr, value)
        if has_attribute?(attr)
          super
        else
          unknown_attributes[attr.to_s] = value
        end
      end
    end
  end
end
