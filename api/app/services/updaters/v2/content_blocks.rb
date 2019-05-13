module Updaters
  module V2
    class ContentBlocks < Updaters::AbstractUpdater

      has_position!

      with_options default: nil do

        string :type

        # jsonb :configuration, default: {}, null: false

        # default true
        boolean :visible

        record :project
      end

      validates :project, presence: true
    end
  end
end
