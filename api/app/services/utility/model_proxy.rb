module Utility
  class ModelProxy
    extend Dry::Initializer
    extend Memoist

    include Dry::Equalizer.new(:name)

    MODEL_NAME = ->(_, proxy) do
      namespace = proxy.name.deconstantize.safe_constantize.yield_self do |n|
        n.respond_to?(:use_relative_model_naming?) && n.use_relative_model_naming?
      end

      ActiveModel::Name.new proxy, namespace
    end

    param :name, Types::String

    option :model_name, MODEL_NAME, optional: true, default: proc { nil }

    memoize def klass
      name.constantize
    end
  end
end
