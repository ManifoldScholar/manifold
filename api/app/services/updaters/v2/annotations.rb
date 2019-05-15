module Updaters
  module V2
    class Annotations < Updaters::AbstractUpdater
      with_options default: nil do
        string :start_node
        string :end_node
        integer :start_char
        integer :end_char
        # string :format
        string :subject
        string :body
        boolean :private

        record :text_section
        # record :resource # not required
        # record :resource_collection # not required
      end

      validates :creator, presence: true
      validates :text_section, presence: true
    end
  end
end
