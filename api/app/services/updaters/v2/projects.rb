module Updaters
  module V2
    class Projects < Updaters::AbstractUpdater
      attachment_field :avatar
      attachment_field :hero
      attachment_field :cover

      # TODO add metadata(Project)

      with_options default: nil do

        # TODO add string :facebook_id
        # TODO add string :twitter_id
        # TODO add string :instagram_id

        string :title
        string :subtitle
        boolean :featured
        string :hashtag
        string :description

        string :purchase_url
        # QUESTION does purchase_price_money exist?
        string :purchase_price_currency
        string :purchase_call_to_action

        boolean :hide_activity
        string :download_url
        # TODO check if remove_hero is a boolean
        # TODO check if draft is a boolean
        # TODO check if remove_cover is a boolean
        string :download_call_to_action
        string :publication_date
        # QUESTION is this part of avatar attachment?
        string :avatar_color

        string :slug
        # QUESTION what is tag_list?
        boolean :dark_mode
        string :image_credits
      end

      validates :creator, presence: true
    end
  end
end
