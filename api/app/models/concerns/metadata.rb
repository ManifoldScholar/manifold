# Helpers for hash attributes
module Metadata
  extend ActiveSupport::Concern

  include ActiveSupport::Configurable
  include HasFormattedAttributes

  included do
    config_accessor :metadata_properties, instance_writer: false do
      []
    end

    config_accessor :camelized_metadata_properties, instance_writer: false do
      []
    end
  end

  def filter_metadata(properties = metadata_properties)
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

  def prepare_metadata!
    preformat_keywords

    filter_metadata
  end

  class_methods do
    def with_metadata(properties)
      attribute :metadata, :indifferent_hash

      config.metadata_properties = properties
      config.camelized_metadata_properties = properties.map { |p| p.camelize(:lower) }

      has_formatted_attributes(properties.map(&:to_sym),
                               include_wrap: false,
                               renderer_options: { no_links: false },
                               container: :metadata)

      before_save :prepare_metadata!
    end
  end
end
