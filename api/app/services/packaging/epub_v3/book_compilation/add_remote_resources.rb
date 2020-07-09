module Packaging
  module EpubV3
    module BookCompilation
      # Add in remote resources
      class AddRemoteResources
        include Packaging::PipelineOperation

        # @param [Packaging::EpubV3::BookContext] context
        # @return [void]
        def call(context)
          context.with!(:book, :compiled_text) do |book, compiled_text|
            compiled_text.remote_resources.each_with_index do |remote_resource, index|
              item = add_remote_resource! book, remote_resource, index

              next unless remote_resource.has_asset?

              # :nocov:
              add_fallback! book, item: item, remote_resource: remote_resource
              # :nocov:
            end
          end
        end

        private

        # @param [GEPUB::Book] book
        # @param [Packaging::EpubV3::RemoteResourceItem] remote_resource
        # @param [Integer] index
        # @return [GEPUB::Item] the remote resource item
        def add_remote_resource!(book, remote_resource, index)
          id = "remote-resource-%05d" % [index + 1]

          item = book.add_item remote_resource.url.to_s, id: id

          item.set_media_type remote_resource.content_type

          return item
        end

        # @param [GEPUB::Book] book
        # @param [GEPUB::Item] item
        # @param [Packaging::EpubV3::RemoteResourceItem] remote_resource
        # @return [GEPUB::Item] the fallback item
        def add_fallback!(book, item:, remote_resource:)
          # :nocov:
          external_source = remote_resource.external_source

          item.fallback = external_source.source_identifier

          fallback = book.add_item external_source.source_path,
                                   id: external_source.source_identifier

          fallback.add_content external_source.asset.to_io

          fallback.set_media_type external_source.content_type

          return fallback
          # :nocov:
        end
      end
      # rubocop:enable
    end
  end
end
