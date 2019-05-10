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
        string :body
        boolean :is_external_link
        string :external_link
        boolean :open_in_new_tab
        string :purpose
      end

      validates :creator, presence: true
    end
  end
end
