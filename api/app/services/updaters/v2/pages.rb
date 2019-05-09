module Updaters
  module V2
    class Pages < Updaters::AbstractUpdater
      with_options default: nil do
        string :title
        string :nav_title
        boolean :show_in_footer
        boolean :show_in_header
        string :slug
        boolean :hidden
        text :body
        boolean :is_external_link
        text :external_link
        boolean :open_in_new_tab
        string :creator_id
        string :purpose
      end
    end
  end
end
