module Updaters
  module V2
    class ActionCallouts < Updaters::AbstractUpdater
      attachment_field :attachment_data

      with_options default: nil do
        string :title
        string :url
        integer :kind
        integer :location
        boolean :button
        integer :position
        string :project_id
        string :text_id
      end
    end
  end
end
