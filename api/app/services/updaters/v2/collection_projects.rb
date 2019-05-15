module Updaters
  module V2
    class CollectionProjects < Updaters::AbstractUpdater
      has_position!

      with_options default: nil do
        record :project
        record :project_collection
      end

      validates :project, presence: true
      validates :project_collection, presence: true
    end
  end
end
