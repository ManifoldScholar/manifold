# frozen_string_literal: true

module ManifoldOAI
  class RecordSynchronizer
    include Dry::Monads[:result]
    include Dry::Initializer[undefined: false].define -> do
      param :source, Types::RecordSource
    end

    # @return [ManifoldOAIRecord]
    attr_reader :record

    # @return [Dry::Monads::Result(void)]
    def call
      prepare!

      assign_metadata!

      record.save!

      maybe_link_project!

      maybe_link_journal!

      maybe_link_project_collection!

      maybe_link_to_directory!

      Success(record)
    end

    private

    # @return [void]
    def assign_metadata!
      @record.oai_dc_content = source.oai_dc_document
    end

    # @return [void]
    def prepare!
      @record = ManifoldOAIRecord.where(source:).first_or_initialize
      @projects_set = ManifoldOAISet.fetch_projects!
      @journals_set = ManifoldOAISet.fetch_journals!
      @directory_set = ManifoldOAISet.fetch_directory!
      @project_collections_set = ManifoldOAISet.fetch_project_collections!

      ManifoldOAISet.fetch_issues!
    end

    # @return [void]
    def maybe_link_project!
      return unless source.kind_of?(Project) && !source.journal_issue?

      @projects_set.link! record
    end

    # @return [void]
    def maybe_link_journal!
      return unless source.kind_of?(Journal)

      @journals_set.link! record
    end

    # @return [void]
    def maybe_link_project_collection!
      return unless source.kind_of?(ProjectCollection)

      @project_collections_set.link! record
    end

    # @return [void]
    def maybe_link_to_directory!
      return if @directory_set.nil?
      return unless source.is_a?(Project) || source.is_a?(Journal)

      should_exclude = source.exclude_from_directory ||
                      (source.is_a?(Project) && source.journal_issue_id.present?)

      if should_exclude
        unlink_from_directory!
      else
        @directory_set.link! record
      end
    end

    # @return [void]
    def unlink_from_directory!
      return if @directory_set.nil? || record.nil?

      ManifoldOAISetLink.where(
        manifold_oai_set: @directory_set,
        manifold_oai_record: record
      ).destroy_all
    end
  end
end
