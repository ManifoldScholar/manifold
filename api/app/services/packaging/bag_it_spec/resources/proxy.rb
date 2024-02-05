module Packaging
  module BagItSpec
    module Resources
      # Proxies a {Resource} for a {Project} to serialize it into the bagit structure.
      class Proxy
        extend Dry::Initializer
        extend Memoist

        include Packaging::BagItSpec::BuildsEntries

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

        def build_entries(builder)
          builder.json! :metadata, root.join("metadata.json"), resource.packaging_metadata
        end

        private

        def attachment_index_map
          Utility::IndexMap.new(:name, Types.Instance(Packaging::BagItSpec::Resources::AttachmentProxy))
        end
      end
    end
  end
end
