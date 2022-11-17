# frozen_string_literal: true

module Utility
  module EnhancedStoreModel
    extend ActiveSupport::Concern

    included do
      include StoreModel::Model
    end

    # @param [#to_s] attr
    # @return [Object]
    def [](attr)
      public_send(attr)
    end

    # @param [#to_s] attr
    # @param [Object]
    # @return [void]
    def []=(attr, value)
      public_send(:"#{attr}=", value)
    end

    # @param [{ Symbol => Object }] attrs
    # @return [void]
    def merge!(attrs)
      return unless attrs.is_a?(Hash)

      attrs.each do |attr, value|
        self[attr] = value
      end
    end
  end
end
