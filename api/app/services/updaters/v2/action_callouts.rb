module Updaters
  module V2
    class ActionCallouts < Updaters::AbstractUpdater
      attachment_field :attachment_data

      has_position!

      with_options default: nil do
        string :title
        string :url
        integer :kind
        integer :location
        boolean :button
        record :project
        record :text
      end

      validates :project, presence: true
      validates :text, presence: true
    end
  end
end
