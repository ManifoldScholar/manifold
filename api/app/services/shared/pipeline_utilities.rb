# frozen_string_literal: true

module Shared
  PipelineUtilities = Dry::Core::Container::Namespace.new("utilities") do
    register("provide_state", memoize: true) do
      ManifoldApi::Container["shared.provide_pipeline_state"]
    end
  end
end
