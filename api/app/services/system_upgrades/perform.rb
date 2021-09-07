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
    # rubocop:disable Lint/UnderscorePrefixedVariableName
    def execute
      applied = false

      filtered_upgrades.each do |upgrade_interaction|
        _result, upgrade_output = compose upgrade_interaction, inputs
        applied = true if _result && !noop
        output.write upgrade_output
      end

      reindex_records if applied && reindex

      output.string
    end
    # rubocop:enable Lint/UnderscorePrefixedVariableName

    private

    # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
    def reindex_records
      logger.info("[-ANY-]===================================================================")
      logger.info("[-ANY-]Reindex All Records                                                ")
      logger.info("[-ANY-]===================================================================")
      logger.info("[-ANY-]Most Manifold updates includes changes to what model data is       ")
      logger.info("[-ANY-]indexed. To accommodate those changes, all records must be         ")
      logger.info("[-ANY-]reindexed. This may take a few minutes, so now is a good time to   ")
      logger.info("[-ANY-]make that cup of tea.                                              ")
      logger.info("[-ANY-]===================================================================")
      Rails.application.eager_load!
      begin
        Searchkick.models.each do |model|
          logger.info("Reindexing #{model.name}...")
          model.searchkick_index.delete if model.searchkick_index.exists?
          model.reindex
        end
      rescue Faraday::ConnectionFailed
        elastic_connection_error
      rescue StandardError => e
        # We really do want to continue if reindexing fails.
        logger.error(e)
      end
    end
    # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

    def filtered_upgrades
      return upgrade_interactions unless version.present?

      upgrade_interactions.filter { |klass| klass.version_string == version }
    end

    def load_upgrades!
      @upgrade_interactions = SystemUpgrades.eager_load_upgrades!
    end
  end
end
