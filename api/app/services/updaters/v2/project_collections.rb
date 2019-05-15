module Updaters
  module V2
    class ProjectCollections < Updaters::AbstractUpdater

      has_position!

      with_options default: nil do
        string :title
        string :sort_order
        boolean :smart
        boolean :visible
        boolean :homepage
        string :icon
        # QUESTION where is tag_list?
        integer :number_of_projects # not required
        boolean :featured_only
        string :description # not required
        string :slug
        string :homepage_start_date # not required
        string :homepage_end_date # not required
        integer :homepage_count # not required
      end

      validates :creator, presence: true
    end
  end
end
