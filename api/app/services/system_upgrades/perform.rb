module SystemUpgrades
  class Perform < ActiveInteraction::Base
    include SystemUpgrades::HasLogger
    include SystemUpgrades::Utilities

    boolean :force, default: false
    boolean :noop, default: false
    boolean :stdout, default: false

    set_callback :execute, :before, :load_upgrades!

    attr_reader :upgrade_interactions

    # @return [String]
    def execute

      applied = false

      upgrade_interactions.each do |upgrade_interaction|
        _result, upgrade_output = compose upgrade_interaction, inputs
        applied = true if _result && !noop
        output.write upgrade_output
      end

      reindex_records if applied

      output.string
    end

    private

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
          model.reindex
        end
      rescue Faraday::ConnectionFailed
        elastic_connection_error
      end
    end

    def load_upgrades!
      @upgrade_interactions = SystemUpgrades.eager_load_upgrades!
    end
  end
end
