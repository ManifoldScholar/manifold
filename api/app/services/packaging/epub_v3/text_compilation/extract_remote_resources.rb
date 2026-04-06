# frozen_string_literal: true

module Packaging
  module EpubV3
    module TextCompilation
      # Extract and flatten {Stylesheet} resources (which have
      # already {Packaging::EpubV3::StylesheetItem been wrapped}).
      #
      # @see Packaging::EpubV3::TextSectionCompilation::ExtractStylesheets
      class ExtractRemoteResources
        include ::Packaging::PipelineOperation
        include CachedExternalSources::Import[fetch_external_source: "pipeline"]

        # @param [Hash] state
        # @return [<Packaging::EpubV3::RemoteResourceItem>]
        def call
          remote_resources = state[:text_sections].flat_map(&:remote_resources).uniq

          remote_resources.map do |remote_resource|
            fetch_external_source.call remote_resource.url do |m|
              m.success do |external_source|
                remote_resource.with_external_source external_source
              end

              m.failure do |code, reason|
                return Failure([code, reason])
              end
            end
          end

          state[:remote_resources] = remote_resources

          Success()
        end
      end
    end
  end
end
