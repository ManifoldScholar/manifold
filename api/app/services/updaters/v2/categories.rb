module Updaters
  module V2
    class Categories < Updaters::AbstractUpdater

      has_position!

      with_options default: nil do
        string :title
        string :role
      end

      validates :project, presence: true
    end
  end
end
