module Updaters
  module V2
    class Stylesheets < Updaters::AbstractUpdater

      has_position!

      with_options default: nil do
        string :raw_styles
        string :name
        record :text_sections
      end

      validates :text_sections, presence: true
      validates :creator, presence: true

    end
  end
end
