module Updaters
  module V2
    class ResourceCollections < Updaters::AbstractUpdater

      # TODO generate thumbnail attachment

      with_options default: nil do
        string :title
        string :description
        boolean :remove_thumbnail
        record :project
        record :resources
      end

      validates :resources, presence: true
      validates :project, presence: true
    end
  end
end
