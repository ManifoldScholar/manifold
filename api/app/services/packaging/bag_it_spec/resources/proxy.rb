module Packaging
  module BagItSpec
    module Resources
      # Proxies a {Resource} for a {Project} to serialize it into the bagit structure.
      class Proxy
        extend Dry::Initializer
        extend Memoist

        include Packaging::BagItSpec::BuildsEntries

        # Attributes that should be copied to files
        # of the same name in the top-level {#root}.
        #
        # @see #build_entries
        ATTRIBUTE_ENTRIES = %i[
          kind sub_kind
          external_id external_type external_url
        ].freeze

        # Attributes that should be copied to {#root}/text
        #
        # @see #build_entries
        TEXT_ENTRIES = %i[title description caption].freeze

        param :resource, Types.Instance(::Resource)

        delegate :slug, to: :resource

        # @!attribute [r] attachments
        # @return [Utility::IndexMap<Packaging::BagItSpec::Resources::AttachmentProxy>]
        memoize def attachments
          resource.shrine_attachment_proxies.each_with_object(attachment_index_map) do |attachment_proxy, proxies|
            next unless attachment_proxy.has_uploaded_file?

            proxies << Packaging::BagItSpec::Resources::AttachmentProxy.new(self, attachment_proxy)
          end
        end

        # @param [Boolean] include_attachments whether to also include entries from individual {#attachments}
        # @yield [entry]
        # @yieldparam [Packaging::BagItSpec::Entries::Base] entry
        # @yieldreturn [void]
        # @return [self]
        def each_entry(include_attachments: true)
          return enum_for(__method__, include_attachments: include_attachments) unless block_given?

          entries.each_value do |entry|
            yield entry
          end

          if include_attachments
            attachments.each_value do |attachment|
              attachment.entries.each_value do |entry|
                yield entry
              end
            end
          end

          return self
        end

        # @!attribute [r] root
        # @return [Pathname]
        memoize def root
          Pathname.new(File.join("resources", slug))
        end

        # rubocop:disable Metrics/AbcSize
        def build_entries(builder)
          ATTRIBUTE_ENTRIES.each do |attr|
            builder.simple! attr, root.join(attr.to_s), resource[attr]
          end

          TEXT_ENTRIES.each do |attr|
            builder.simple! attr, root.join("txt", attr.to_s), resource[attr]
          end

          builder.json! :metadata, root.join("metadata.json"), resource.metadata
          builder.json! :tags, root.join("tags.json"), resource.tag_list
        end
        # rubocop:enable Metrics/AbcSize

        private

        def attachment_index_map
          Utility::IndexMap.new(:name, Types.Instance(Packaging::BagItSpec::Resources::AttachmentProxy))
        end
      end
    end
  end
end
