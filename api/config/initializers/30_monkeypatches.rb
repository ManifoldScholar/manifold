require Rails.root.join("lib", "patches", "better_interactions").to_s
require Rails.root.join("lib", "patches", "metadown_custom_renderer").to_s
require Rails.root.join("lib", "patches", "better_enums").to_s
require Rails.root.join("lib", "patches", "elasticsearch-dsl").to_s
require Rails.root.join("lib", "patches", "for_shrine").to_s
require Rails.root.join("lib", "patches", "friendly_id_uniqueness").to_s
require Rails.root.join("lib", "patches", "ahoy").to_s

# See https://github.com/nahi/httpclient/issues/252
class WebAgent
  class Cookie < HTTP::Cookie
    def domain
      original_domain
    end
  end
end

# We want to namespace some serializers.
module FastJsonapi
  module ObjectSerializer
    class_methods do
      def compute_serializer_name(serializer_key)
        return serializer_key unless serializer_key.is_a? Symbol

        serializer_map = {
          ResourcesBlock: :'::V1::Content::ResourcesBlockSerializer',
          MarkdownBlock: :'::V1::Content::MarkdownBlockSerializer',
          RecentActivityBlock: :'::V1::Content::RecentActivityBlockSerializer',
          TableOfContentsBlock: :'::V1::Content::TableOfContentsBlockSerializer',
          TextsBlock: :'::V1::Content::TextsBlockSerializer',
          MetadataBlock: :'::V1::Content::MetadataBlockSerializer'
        }
        return serializer_map[serializer_key] if serializer_map.key?(serializer_key)

        namespace = name.gsub(/()?\w+Serializer$/, "")
        serializer_name = serializer_key.to_s.classify + "Serializer"
        (namespace + serializer_name).to_sym
      end
    end
  end
end

# Google cloud storage needs to deal with the underlying IO stream, not the TUS wrapper,
# which doesn't respond to all the methods that GCS needs to see for it to be a viable
# stream. This patch exposes the underlying input to our TusGcs storage.
module ::Tus
  class Input
    def get_input
      @input
    end
  end
end
