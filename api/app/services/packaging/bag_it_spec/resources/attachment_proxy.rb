# frozen_string_literal: true

module Packaging
  module BagItSpec
    module Resources
      # Proxies all of a {Resource}'s {Attachments::Proxy attachment proxies} to serialize them into the bagit structure.
      class AttachmentProxy
        extend Dry::Initializer
        extend Memoist

        include Packaging::BagItSpec::BuildsEntries
        include Packaging::BagItSpec::Import[name_parser: "resources.attachment_name_parser"]

        param :resource_proxy, Types.Instance(Packaging::BagItSpec::Resources::Proxy)
        param :attachment_proxy, Types.Instance(Attachments::Proxy)

        delegate :resource, to: :resource_proxy
        delegate :content_type, :metadata, :name, :original_filename, :uploaded_file, to: :attachment_proxy

        # @!attribute [r] root
        # @return [Pathname]
        memoize def root
          resource_proxy.root.join("files", *path_parts)
        end

        def build_entries(builder)
          builder.attachment! :file, root.join(original_filename), uploaded_file
          builder.json! :metadata, root.join("metadata.json"), metadata
        end

        private

        # @!attribute [r] path_parts
        # @return [<String>]
        memoize def path_parts
          name_parser.call(name)
        end
      end
    end
  end
end
