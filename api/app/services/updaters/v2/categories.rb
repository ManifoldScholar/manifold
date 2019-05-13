module Updaters
  module V2
    class Categories < Updaters::AbstractUpdater

      # make sure it has a position
      has_position!

      with_options default: nil do
        string :title
        string :role
        record :project
      end

      # ensure that the project record exists
      validates :project, presence: true
    end
  end
end
