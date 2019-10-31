module Packaging
  module EpubV3
    module TextCompilation
      class LinkExternalSources
        include Packaging::PipelineOperation

        # @param [Hash] state
        # @option state [Text] :text
        # @option state [<Packaging::EpubV3::RemoteResourceItem>] :remote_resources
        # @return [void]
        def call(state)
          remote_resources, text = state.values_at :remote_resources, :text

          remote_resources.each do |remote_resource|
            remote_resource.external_source.links.by_text(text).build.upsert!
          end
        end
      end
    end
  end
end
