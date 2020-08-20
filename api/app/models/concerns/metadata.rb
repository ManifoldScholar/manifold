# Helpers for hash attributes
module Metadata
  extend ActiveSupport::Concern
  include HasFormattedAttributes

  def filter_metadata(properties)
    return unless metadata_changed?

    write_attribute(:metadata, metadata.slice(*properties))
  end

  def metadata=(value)
    base = metadata || {}
    new = base.merge(value).delete_if { |_k, v| v.blank? }
    write_attribute(:metadata, new)
  end

  def metadata_formatted
    metadata.each_with_object({}) do |(k, _v), out|
      next unless respond_to? "#{k}_formatted".to_sym

      out[k] = send("#{k}_formatted")
    end
  end

  def preformat_keywords
    return unless metadata.key? "keywords"

    keywords = metadata["keywords"].split(/[,;]/)
    metadata["keywords"] = keywords&.reject(&:blank?)&.map(&:strip)&.join(", ")
  end

  class_methods do
    def camelized_metadata_properties
      @camelized_metadata_properties
    end

    def metadata_properties
      @metadata_properties
    end

    def with_metadata(properties)
      attr_reader :metadata_properties, :camelized_metadata_properties

      @metadata_properties = properties
      has_formatted_attributes(properties&.map(&:to_sym),
                               include_wrap: false,
                               renderer_options: { no_links: false },
                               container: :metadata)

      after_initialize do
        @metadata_properties = properties
        @camelized_metadata_properties = properties.map { |p| p.camelize(:lower) }
      end

      before_save do
        preformat_keywords
        filter_metadata(properties)
      end
    end
  end
end
