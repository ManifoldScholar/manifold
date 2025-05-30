# frozen_string_literal: true

module MultisearchDocumentEnhancement
  extend ActiveSupport::Concern

  include AssociationHelpers

  included do
    belongs_to :journal, optional: true
    belongs_to :project, optional: true
    belongs_to :text, optional: true
    belongs_to :text_section, optional: true

    scope :for_journal, ->(journal) { where(journal: journal) }
    scope :for_project, ->(project) { where(project: project) }
    scope :for_text, ->(text) { where(text: text) }
    scope :for_text_section, ->(text_section) { where(text_section: text_section) }

    scope :sans_draft_projects, -> do
      left_outer_joins(:project).where(Project.arel_table[:id].eq(nil).or(Project.arel_table[:draft].eq(false)))
    end

    scope :sans_draft_journals, -> do
      left_outer_joins(:journal).where(Journal.arel_table[:id].eq(nil).or(Journal.arel_table[:draft].eq(false)))
    end

    scope :with_default_associations, -> do
      includes(:project, :text_section, text: %i[titles text_subjects category])
    end

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

  def serialized_highlights
    {
      parent_keywords: [],
      keywords: [],
      makers: [],
      full_text: [pg_search_highlight],
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

  # @param [Project, Text]
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
        .search(keyword)
        .with_pg_search_rank
        .with_pg_search_highlight.then do |q|
          tsearch = q.__send__(:tsearch)

          with_highlighted_title(query: q, tsearch: tsearch)
        end
        .with_default_associations
        .faceted_by(*facets)

      query = query.for_project(project) unless project.nil?
      query = query.for_text(text) unless text.nil?
      query = query.for_text_section(text_section) unless text_section.nil?

      return query
    end

    # @return [ActiveRecord::Relation<PgSearch::Document>]
    def faceted_by(*facets)
      searchable_type = facets.flatten.compact_blank.presence

      return all if searchable_type.blank?

      where(searchable_type: searchable_type)
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
