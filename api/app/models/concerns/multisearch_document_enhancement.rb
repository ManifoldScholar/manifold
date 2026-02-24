# frozen_string_literal: true

# This concern acts as an enhancement to PgSearch::Document to add
# additional associations, scopes, and methods necessary for our multisearch
# implementation.
#
# It also adds support for faceted searching based on the `searchable_type`
# of the multisearch documents.
#
# @api private
# @see Search::Faceter
module MultisearchDocumentEnhancement
  extend ActiveSupport::Concern

  include ArelHelpers
  include AssociationHelpers

  SEARCHABLE_TYPES = %i[
    annotation
    journal
    project
    resource
    text
    text_section
  ].freeze

  SEARCHABLE_TYPE_MAP = SEARCHABLE_TYPES.index_with { _1.to_s.classify }.freeze

  SEARCHABLE_LOOKUP_MAP = SEARCHABLE_TYPE_MAP.invert.transform_values { :"searchable_#{_1}" }

  STANDARD_ASSOCIATIONS = {
    journal: [
      :creator,
      :creators,
    ],
    project: [
      :creator,
      :creators,
    ],
    text: [
      :creator,
      :creators,
      :category,
      :stylesheets,
      :titles,
      :text_subjects,
    ],
    text_section: [],
  }.freeze

  SEARCHABLE_ASSOCIATIONS = {
    annotation: [
      :creator,
      {
        annotation_node: {
          ancestor_node: %i[children]
        },
      }
    ],
    journal: [
      :creator,
      :creators,
    ],
    project: [
      :creator,
      :creators,
    ],
    text: [
      :creator,
      :creators,
      :category,
      :stylesheets,
      :titles,
      :text_subjects,
    ],
    text_section: {
      stylesheets: [],
      text: [],
    },
  }.freeze

  SEARCHABLE_TYPE_ASSOCIATIONS = SEARCHABLE_TYPES.each_with_object({}) do |key, h|
    h[:"searchable_#{key}"] = SEARCHABLE_ASSOCIATIONS.fetch(key, [])
  end

  DEFAULT_ASSOCIATIONS = STANDARD_ASSOCIATIONS.merge(SEARCHABLE_TYPE_ASSOCIATIONS)

  included do
    belongs_to :journal, optional: true
    belongs_to :project, optional: true
    belongs_to :text, optional: true
    belongs_to :text_section, optional: true

    SEARCHABLE_TYPE_MAP.each do |(key, class_name)|
      belongs_to_readonly :"searchable_#{key}", class_name:, foreign_key: :searchable_id, optional: true
    end

    scope :for_journal, ->(journal) { where(journal:) }
    scope :for_project, ->(project) { where(project:) }
    scope :for_text, ->(text) { where(text:) }
    scope :for_text_section, ->(text_section) { where(text_section:) }

    scope :sans_draft_projects, -> do
      where(arel_sans_draft_projects)
    end

    scope :sans_draft_journals, -> do
      where(arel_sans_draft_journals)
    end

    scope :with_default_associations, -> do
      preload(**DEFAULT_ASSOCIATIONS)
    end

    scope :journal_content, -> { where(journal_content: true) }

    has_many_readonly :text_section_nodes, -> { current }, primary_key: :text_section_id, foreign_key: :text_section_id

    attribute :secondary_data, ::Search::SecondaryData.to_type
    attribute :tertiary_data, ::Search::TertiaryData.to_type
    attribute :metadata, ::Search::Metadata.to_type

    delegate :keywords, :makers, to: :secondary_data

    delegate :parent_keywords, to: :tertiary_data
  end

  # @note Nothing for now.
  # @return [String, nil]
  def full_text
    nil
  end

  # @!attribute [r] searchable_model
  # This attribute acts as a proxy for the `searchable` polymorphic association,
  # but allows for us to do the right sort of eager loading necessary for each
  # record. There are still some N+1 issues in serialization, but they existed
  # prior to the search refactor.
  # @return [ApplicationRecord]
  def searchable_model
    case searchable_type
    when "Annotation"
      searchable_annotation
    when "Journal"
      searchable_journal
    when "Project"
      searchable_project
    when "Resource"
      searchable_resource
    when "Text"
      searchable_text
    when "TextSection"
      searchable_text_section
    end
  end

  def serialized_highlights
    {
      parent_keywords: [],
      keywords: [],
      makers: [],
      full_text: [],
      title: [pg_highlighted_title],
    }
  end

  def serialized_parents
    %i[project text text_section].each_with_object({}) do |assoc_name, h|
      parent = __send__(assoc_name)

      next if parent.blank?

      h[assoc_name] = serialized_parent(parent)
    end.compact_blank
  end

  # @!group Text Node Methods

  # @return [String]
  attr_accessor :search_keyword

  def exposes_text_node_hits?
    search_result_type == "text_section"
  end

  def text_nodes
    {
      hits: text_node_hits,
      total: {
        value: text_node_hits.size,
      },
    }
  end

  # @api private
  # @param [String] keyword
  # @param [{ String => <Hash> }] all_hits hashes keyed by `text_section_id`
  def assign_text_node_hits!(keyword, all_hits)
    self.search_keyword = keyword

    @text_node_hits = all_hits.fetch(text_section_id, Dry::Core::Constants::EMPTY_ARRAY)
  end

  # @return [<TextSectionNode>]
  def text_node_hits
    @text_node_hits ||= Dry::Core::Constants::EMPTY_ARRAY
  end

  # @!endgroup

  private

  # @param [Project, Text] model
  # @return [Hash]
  def serialized_parent(model)
    model.slice(:id, :slug, :title)
  end

  module ClassMethods
    # @return [ActiveRecord::Relation<PgSearch::Document>]
    def faceted_search_for(keyword, facets: [], project: nil, text: nil, text_section: nil)
      query = all
        .sans_draft_projects
        .sans_draft_journals
        .faceted_by(*facets)
        .search(keyword)
        .with_pg_search_rank
        .then do |q|
          tsearch = q.__send__(:tsearch)

          with_highlighted_title(query: q, tsearch: tsearch)
        end
        .with_default_associations

      query = query.for_project(project) unless project.nil?
      query = query.for_text(text) unless text.nil?
      query = query.for_text_section(text_section) unless text_section.nil?

      return query
    end

    # @see Search::Faceter
    # @param [<Search::Types::Facet>] facets
    # @return [ActiveRecord::Relation<PgSearch::Document>]
    def faceted_by(*facets)
      faceter = Search::Faceter.new(facets.flatten.compact_blank)

      faceter.(all)
    end

    def arel_sans_draft_projects
      arel_table[:project_id].eq(nil).or(Arel::Nodes::Not.new(arel_attr_in_query(:project_id, Project.drafts.select(:id))))
    end

    def arel_sans_draft_journals
      arel_table[:journal_id].eq(nil).or(Arel::Nodes::Not.new(arel_attr_in_query(:journal_id, Journal.drafts.select(:id))))
    end

    private

    def arel_highlighted(expr, tsearch:)
      Arel::Nodes::NamedFunction.new(
        "ts_headline",
        [
          tsearch.__send__(:dictionary),
          expr,
          tsearch.__send__(:arel_wrap, tsearch.__send__(:tsquery)),
          Arel::Nodes.build_quoted(tsearch.__send__(:ts_headline_options))
        ]
      )
    end

    # @note Must be used _after_ `with_pg_search_highlight`
    # @return [ActiveRecord::Relation<PgSearch::Document>]
    def with_highlighted_title(query:, tsearch:)
      query.select(arel_highlighted(arel_table[:title], tsearch: tsearch).as("pg_highlighted_title"))
    end
  end
end
