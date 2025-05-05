# frozen_string_literal: true

module Packaging
  module BagItSpec
    module Compilation
      # Proxify a {Resource} into a {Packaging::BagItSpec::Resources::Proxy}.
      class PrepareResource
        include Packaging::PipelineOperation

        # @param [Resource] resource
        # @return [Packaging::BagItSpec::Resources::Proxy]
        def call(resource)
          Success Packaging::BagItSpec::Resources::Proxy.new resource
        end
      end
    end
  end
end
