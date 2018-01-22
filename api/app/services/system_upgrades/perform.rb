module SystemUpgrades
  class Perform < ActiveInteraction::Base
    include SystemUpgrades::HasLogger

    boolean :force, default: false
    boolean :stdout, default: false

    # @return [String]
    def execute
      upgrade_interactions.each do |upgrade_interaction|
        _result, upgrade_output = compose upgrade_interaction, inputs

        output.write upgrade_output
      end

      output.string
    end

    def upgrade_interactions
      @upgrade_interactions ||=
        begin
          Rails.application.eager_load! if Rails.env.development?

          SystemUpgrades::AbstractVersion.descendants.sort_by(&:version)
        end
    end
  end
end
