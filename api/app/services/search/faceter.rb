# frozen_string_literal: true

module Search
  # The API for facets is based on the original ElasticSearch implementation.
  # It receives a list of model names that is used to determine which content
  # should be included in the result (with an empty list signifying "all").
  #
  # However, there is a selective case for dealing with situations where
  # "Project" XOR "Journal" is included in the facets list. In these cases,
  # we need to exclude projects that are not associated with journals (for
  # "Journal" only) or exclude projects that are associated with journals
  # (for "Project" only).
  #
  # In these cases, we use a selective "journal_content" boolean column on
  # {PgSearch::Document} to determine whether a given project is associated
  #
  # @api private
  # @see MultisearchDocumentEnhancement
  class Faceter
    extend Dry::Core::Cache

    include ArelHelpers::ClassMethods

    include Dry::Core::Constants
    include Dry::Initializer[undefined: false].define -> do
      param :facets, Search::Types::Facets, default: proc { EMPTY_ARRAY }
    end

    delegate :arel_table, to: :class

    # @return [Arel::Nodes::Node, nil]
    attr_reader :condition

    # @return [Hash{String => Boolean}]
    attr_reader :inclusions

    # @return [Search::Types::Facets]
    attr_reader :search_facets

    def initialize(...)
      super

      @all = fetch_or_store(facets, :all) do
        facets.blank? || facets == Search::Types::FACETS
      end

      @inclusions = fetch_or_store(facets, :inclusions) do
        Search::Types::FACETS.index_with do |facet|
          all? || facet.in?(facets)
        end
      end

      @search_facets = fetch_or_store(facets, :search_facets) do
        build_search_facets
      end

      @condition = fetch_or_store(facets, :condition) do
        build_condition
      end
    end

    # @param [ActiveRecord::Relation<PgSearch::Document>] scope
    # @return [ActiveRecord::Relation<PgSearch::Document>]
    def call(scope)
      return scope if all?

      scope.where(condition)
    end

    # @!group Predications

    # @return [Boolean]
    attr_reader :all

    alias all? all
    alias everything? all?

    def disabled?(facet)
      !enabled?(facet)
    end

    alias has_disabled? disabled?
    alias exclude? disabled?

    def enabled?(facet)
      inclusions.fetch(facet, false)
    end

    alias has_enabled? enabled?
    alias include? enabled?

    def exclude_regular_projects?
      enabled?("Journal") && disabled?("Project")
    end

    alias has_regular_projects_excluded? exclude_regular_projects?

    def exclude_journal_projects?
      disabled?("Journal") && enabled?("Project")
    end

    alias has_journal_projects_excluded? exclude_journal_projects?

    def has_selective_project_handling?
      exclude_regular_projects? || exclude_journal_projects?
    end

    def selective?
      !all?
    end

    # @!endgroup

    private

    def build_selective_project_case_statement
      arel_case(arel_table[:searchable_type]) do |stmt|
        if exclude_regular_projects?
          stmt.when("Project").then(arel_table[:journal_content].eq(true))
        elsif exclude_journal_projects?
          stmt.when("Project").then(arel_table[:journal_content].eq(false))
        end

        stmt.else(true)
      end
    end

    # @return [Arel::Nodes::Node, nil]
    def build_condition
      return if all?

      conditions = []

      conditions << arel_table[:searchable_type].in(search_facets)

      if has_selective_project_handling?
        conditions << build_selective_project_case_statement
      end

      conditions.reduce(&:and)
    end

    # @return [Search::Types::Facets]
    def build_search_facets
      return Search::Types::FACETS if all?

      adjusted_facets = facets.dup

      adjusted_facets << "Project" if exclude_regular_projects?

      return adjusted_facets.sort
    end

    class << self
      # @return [Arel::Table]
      def arel_table
        PgSearch::Document.arel_table
      end
    end
  end
end
