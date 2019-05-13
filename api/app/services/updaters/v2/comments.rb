module Updaters
  module V2
    class Comments < Updaters::AbstractUpdater
      with_options default: nil do
        record :subject

        string :body
        string :subject_type

        # default false
        boolean :deleted

        # default 0
        integer :children_count
        # default 0
        integer :flags_count
        integer :sort_order
        # default 0
        integer :events_count
      end

      validates :creator, presence: true
      validates :subject, presence: true
    end
  end
end
