# frozen_string_literal: true

module SearchIndexable
  extend ActiveSupport::Concern

  include Dry::Core::Constants
  include PgSearch::Model

  MULTISEARCH_ADDITIONAL_ATTRIBUTES = ->(instance) { instance.to_multisearch_attributes }

  included do
    extend Dry::Core::ClassAttributes

    defines :keyword_search_options, type: Search::Types::KeywordSearchOptions

    defines :multisearch_options, type: Search::Types::MultisearchOptions

    defines :search_result_type, type: Search::Types::String

    defines :multisearch_draftable, :multisearch_indexed, type: Search::Types::Bool

    defines :multisearch_parent_name, :multisearch_title_attr, :multisearch_secondary_attr, type: Search::Types::Symbol.optional

    multisearch_draftable false

    multisearch_indexed false

    multisearch_parent_name nil

    multisearch_title_attr :title

    multisearch_secondary_attr :subtitle

    keyword_search_options(Dry::Core::Constants::EMPTY_HASH)

    multisearch_options(Dry::Core::Constants::EMPTY_HASH)

    search_result_type derive_search_result_type
  end

  def has_multisearch_parent_name?
    self.class.multisearch_parent_name.present?
  end

  def multisearch_draftable?
    self.class.multisearch_draftable
  end

  # Determine whether or not this record can be included in multisearch at all.
  def should_index?
    !hidden_for_multisearch?
  end

  def hidden_for_multisearch?
    return draft? if multisearch_draftable?

    if has_multisearch_parent_name?
      name = self.class.multisearch_parent_name

      parent = __send__(name)

      if parent.present?
        parent.hidden_for_multisearch?
      else
        # :nocov:
        # This is a throwback for orphaned texts and text sections
        true
        # :nocov:
      end
    end

    false
  end

  # @return [String]
  def search_result_type
    self.class.search_result_type
  end

  def to_multisearch_attributes
    multisearch_base_attributes.merge(extra_multisearch_attributes)
  end

  # @return [String, nil]
  def multisearch_title
    attr = self.class.multisearch_title_attr

    __send__(attr) if respond_to?(attr)
  end

  def multisearch_primary_data
    {}
  end

  # @abstract
  # @return [String, nil]
  def multisearch_secondary
    attr = self.class.multisearch_secondary_attr

    __send__(attr) if respond_to?(attr)
  end

  def multisearch_secondary_data
    {
      full_text: multisearch_full_text,
      keywords: multisearch_keywords,
      makers: multisearch_makers,
    }
  end

  # @abstract
  # @return [String, nil]
  def multisearch_tertiary; end

  def multisearch_tertiary_data
    {
      creator: multisearch_creator,
      parent_keywords: multisearch_parent_keywords,
    }
  end

  def multisearch_metadata
    {
      arbitrary: multisearch_arbitrary_metadata,
    }
  end

  # @api private
  # @return [Hash]
  def extra_multisearch_attributes
    {
      title: multisearch_title,
      primary_data: multisearch_primary_data,
      secondary: multisearch_secondary,
      secondary_data: sanitize_multisearch_nested_data(multisearch_secondary_data),
      tertiary: multisearch_tertiary,
      tertiary_data: sanitize_multisearch_nested_data(multisearch_tertiary_data),
      metadata: sanitize_multisearch_nested_data(multisearch_metadata),
    }
  end

  # @abstract
  def multisearch_arbitrary_metadata
    # :nocov:
    return unless respond_to?(:metadata) && metadata.kind_of?(Hash)
    # :nocov:

    metadata.values.compact_blank
  end

  # @abstract
  def multisearch_creator
    # :nocov:
    return unless respond_to?(:creator) && creator.present? && creator.kind_of?(User) && creator.default_classification?
    # :nocov:

    creator.full_name
  end

  # @abstract
  def multisearch_full_text; end

  # @abstract
  # @return [Boolean]
  def multisearch_journal_content
    case self
    when Journal then true
    when Project then journal_issue?
    else
      false
    end
  end

  # @see #multisearch_journal_content
  def multisearch_journal_content?
    multisearch_journal_content.present?
  end

  # @abstract
  # @return [<String>]
  def multisearch_keywords
    [].tap do |a|
      a.concat(tag_list.to_a) if kind_of?(Taggable)
    end
  end

  # @return [<String>, nil]
  def multisearch_makers
    # :nocov:
    return nil unless respond_to?(:makers)
    # :nocov:

    makers.map(&:full_name)
  end

  # @abstract
  # @return [<String>, nil]
  def multisearch_parent_keywords; end

  private

  # @param [Hash, Array, String] data
  # @return [Object]
  def sanitize_multisearch_nested_data(data)
    case data
    when Array
      data.map do |item|
        sanitize_multisearch_nested_data(item)
      end
    when Hash
      data.compact_blank.deep_transform_values do |item|
        sanitize_multisearch_nested_data(item)
      end
    when String
      data.unaccent
    else
      # :nocov:
      data
      # :nocov:
    end
  end

  def multisearch_base_attributes
    {
      search_result_type:,
      journal_id: multisearch_journal_id,
      journal_issue_id: multisearch_journal_issue_id,
      project_id: multisearch_project_id,
      text_id: multisearch_text_id,
      text_section_id: multisearch_text_section_id,
      journal_content: multisearch_journal_content?,
    }
  end

  # @return [String, nil]
  def multisearch_journal_id
    case self
    when Journal then id
    else
      try(:journal_id)
    end
  end

  def multisearch_journal_issue_id
    try(:journal_issue_id)
  end

  # @return [String, nil]
  def multisearch_project_id
    case self
    when Project then id
    else
      try(:project_id)
    end
  end

  # @return [String, nil]
  def multisearch_text_id
    case self
    when Text then id
    else
      try(:text_id)
    end
  end

  # @return [String, nil]
  def multisearch_text_section_id
    case self
    when TextSection then id
    else
      try(:text_section_id)
    end
  end

  module ClassMethods
    def derive_search_result_type
      name.underscore
    end

    def multisearches!(*against_columns, title_from: :title, secondary_from: :subtitle, **options)
      multisearch_indexed true
      multisearch_title_attr title_from
      multisearch_secondary_attr secondary_from

      options[:additional_attributes] = MULTISEARCH_ADDITIONAL_ATTRIBUTES
      options[:if] = :should_index?
      options[:against] = against_columns.flatten.map(&:to_sym).freeze

      multisearch_options options.freeze

      multisearchable(**options)
    end
  end
end
