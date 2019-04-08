module SystemUpgrades
  class Perform < ActiveInteraction::Base
    include SystemUpgrades::HasLogger

    boolean :force, default: false
    boolean :noop, default: false
    boolean :stdout, default: false

    set_callback :execute, :before, :load_upgrades!

    attr_reader :upgrade_interactions

    # @return [String]
    def execute
      upgrade_interactions.each do |upgrade_interaction|
        _result, upgrade_output = compose upgrade_interaction, inputs

        output.write upgrade_output
      end

      output.string
    end

    private

    def load_upgrades!
      @upgrade_interactions = SystemUpgrades.eager_load_upgrades!
    end
  end
end
