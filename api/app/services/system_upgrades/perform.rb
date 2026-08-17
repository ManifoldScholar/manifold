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
      pending = pending_upgrades

      eager_load_application! if pending.any? && !noop

      applied = false

      pending.each do |upgrade_interaction|
        result, upgrade_output = compose upgrade_interaction, inputs
        applied = true if result && !noop
        output.write upgrade_output
      end

      rebuild_pg_search_documents if applied && reindex

      output.string
    end

    private

    # Upgrades not yet recorded as applied. Forcing treats all as pending.
    # @return [<Class>]
    def pending_upgrades
      return filtered_upgrades if force

      filtered_upgrades.reject { |klass| applied_version_strings.include?(klass.version_string) }
    end

    # @return [Set<String>]
    def applied_version_strings
      @applied_version_strings ||= UpgradeResult.pluck(:version).to_set
    end

    # Rake tasks don't eager load by default
    def eager_load_application!
      return if Rails.env.test?

      Rails.application.eager_load!
    end

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
      @upgrade_interactions = SystemUpgrades.load_upgrade_classes!
    end
  end
end
