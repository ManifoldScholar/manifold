# frozen_string_literal: true

module Collections
  module Types
    include Dry.Types

    Collector = Instance(::Collector)

    Grouping = Instance(::CollectionGrouping)

    Model = ::Types::Model

    ModelProxy = ::Types::ModelProxy

    ModelProxies = Array.of(ModelProxy)
  end
end
