# frozen_string_literal: true

module Packaging
  module EpubV3
    module TextSectionCompilation
      # Extract {Stylesheet} resources into {Packaging::EpubV3::StylesheetItem wrapped proxies}.
      class ExtractRemoteResources
        include ::Packaging::PipelineOperation

        # @param [Hash] state
        # @option state [TextSection] :text_section
        # @return [<Packaging::EpubV3::RemoteResourceItem>]
        def call
          state[:remote_resources] = [].tap do |resources|
            resources.concat state[:stylesheets].flat_map(&:remote_resources)

            resources.concat state[:referenced_items].map(&:to_remote_resource).compact
          end

          Success()
        end
      end
    end
  end
end
