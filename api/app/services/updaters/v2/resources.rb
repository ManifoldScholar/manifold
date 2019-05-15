module Updaters
  module V2
    class Resources < Updaters::AbstractUpdater

      # TODO add attachment(:attachment)
      # TODO add attachment(:high_res)
      # TODO add attachment(:variant_format_one)
      # TODO add attachment(:variant_format_two)
      # TODO add attachment(:variant_thumbnail)
      # TODO add attachment(:variant_poster)

      # TODO add metadata(Resource)

      with_options default: nil do
        # DOES NOT EXIST string :tag_list
        # DOES NOT EXIST string :alt_text
        # DOES NOT EXIST string :copyright_status
        # DOES NOT EXIST string :copyright_holder
        # DOES NOT EXIST string :credit
        # DOES NOT EXIST string :subject
        # DOES NOT EXIST string :maximum_width
        # DOES NOT EXIST string :maximum_height

        string :title
        string :kind
        # QUESTION what do these do? string :remove_attachment
        # QUESTION what do these do? string :remove_high_res
        # QUESTION what do these do? string :remove_variant_format_one
        # QUESTION what do these do? string :remove_variant_format_two
        # QUESTION what do these do? string :remove_variant_thumbnail
        # QUESTION what do these do? string :remove_variant_poster
        string :caption # not required
        string :description # not required
        string :sub_kind # not required
        boolean :allow_download
        string :external_type # not required
        string :external_url # not required
        string :external_id # not required
        string :embed_code # not required
        string :minimum_width # not required
        string :minimum_height # not required
        boolean :iframe_allow_fullscreen
        string :fingerprint
        string :slug

        record :project
        record :creators
      end

      validates :project, presence: true
      validates :creators, presence: true
    end
  end
end
