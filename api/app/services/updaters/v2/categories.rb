module Updaters
  module V2
    class Categories < Updaters::AbstractUpdater
        with_options default: nil do
        string :project_id
        string :title
        string :role
        integer :position
      end
    end
  end
end
