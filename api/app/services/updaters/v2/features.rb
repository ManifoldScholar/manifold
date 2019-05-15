module Updaters
  module V2
    class Features < Updaters::AbstractUpdater

      has_position!

      # attachment_field :background
      # attachment_field :foreground

      with_options default: nil do
        # TODO add attachment(:background)
        # TODO add attachment(:foreground)
        # TODO remove remove_background from validation
        # TODO remove remove_foreground from validation
        boolean :hidden
        boolean :live
        boolean :include_sign_up
        string :header
        string :subheader
        string :body
        string :link_text
        string :link_url
        string :link_target
        string :style
        string :background_color
        string :foreground_color
        string :header_color
        string :layout
        string :foreground_top
        string :foreground_left
        string :foreground_position
      end
    end
  end
end
