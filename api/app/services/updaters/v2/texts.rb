module Updaters
  module V2
    class Texts < AbstractUpdater

      has_position!

      with_options default: nil do

        # TODO: add in metadata(Text)
        # TODO: check if language is still being used
        # TODO: add in rights

        string :title
        string :description
        string :section_kind
        string :subtitle

        date :publication_date

        boolean :published
      end
    end
  end
end
