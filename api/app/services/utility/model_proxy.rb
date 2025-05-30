# frozen_string_literal: true

module Utility
  class ModelProxy
    extend Dry::Initializer
    extend Memoist

    include Dry::Core::Equalizer.new(:name)

    MODEL_NAME = ->(_, proxy) do
      namespace = proxy.name.deconstantize.safe_constantize.then do |n|
        n.respond_to?(:use_relative_model_naming?) && n.use_relative_model_naming?
      end

      ActiveModel::Name.new proxy, namespace
    end

    param :name, Types::String

    option :model_name, MODEL_NAME, optional: true, default: proc {}

    memoize def klass
      name.constantize
    end
  end
end
