# frozen_string_literal: true

module SystemUpgrades
  class Perform < ActiveInteraction::Base
    include SystemUpgrades::HasLogger
    include SystemUpgrades::Utilities

    boolean :force, default: false
    string :version, default: nil
    boolean :noop, default: false
    boolean :stdout, default: false
    boolean :reindex, default: true

    set_callback :execute, :before, :load_upgrades!

    attr_reader :upgrade_interactions

    # @return [String]
    def execute
      applied = false

      filtered_upgrades.each do |upgrade_interaction|
        result, upgrade_output = compose upgrade_interaction, inputs
        applied = true if result && !noop
        output.write upgrade_output
      end

      rebuild_pg_search_documents if applied && reindex

      output.string
    end

    private

    def rebuild_pg_search_documents
      logger.info("[-ANY-]===================================================================")
      logger.info("[-ANY-] Rebuilding Search Indices                                         ")
      logger.info("[-ANY-]===================================================================")
      logger.info("[-ANY-]Most Manifold updates includes changes to what model data is       ")
      logger.info("[-ANY-]indexed. To accommodate those changes, all records must be         ")
      logger.info("[-ANY-]reindexed. This may take a few minutes, so now is a good time to   ")
      logger.info("[-ANY-]make that cup of tea.                                              ")
      logger.info("[-ANY-]===================================================================")

      ManifoldApi::Container["search.rebuild_all"].().value!
    end

    def filtered_upgrades
      return upgrade_interactions unless version.present?

      upgrade_interactions.filter { |klass| klass.version_string == version }
    end

    def load_upgrades!
      @upgrade_interactions = SystemUpgrades.eager_load_upgrades!
    end
  end
end
