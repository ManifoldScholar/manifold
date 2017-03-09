# Model concern that tracks who created a record
module Attachments
  extend ActiveSupport::Concern

  MANIFOLD_ATTACHMENT_IMAGE_STYLES = {
    small: ["320x320"],
    small_square: "",
    small_landscape: "",
    small_portrait: "",
    medium: ["640x640"],
    medium_square: "",
    medium_landscape: "",
    medium_portrait: "",
    large_landscape: ""
  }.freeze

  MANIFOLD_ATTACHMENT_IMAGE_CONVERT_OPTIONS = {
    small_square: "-gravity north -thumbnail 320x320^ -extent 320x320",
    small_landscape: "-gravity north -thumbnail 320x200^ -extent 320x200",
    small_portrait: "-gravity north -thumbnail 200x320^ -extent 200x320",
    medium_square: "-gravity north -thumbnail 640x640^ -extent 640x640",
    medium_landscape: "-gravity north -thumbnail 640x400^ -extent 640x400",
    medium_portrait: "-gravity north -thumbnail 400x640^ -extent 400x640",
    large_landscape: "-gravity north -thumbnail 1280x800^ -extent 1280x800"
  }.freeze

  # rubocop:disable Metrics/BlockLength
  class_methods do
    # Sets up paperclip atttachment configuration for `field`. The `type` argument
    # references attachment validation in Manifold config attachments.validations. This
    # bit of metaprogramming provides a number of methods to the model for each attachment
    # field. If the field name were, for example, "avatar," we'd have the following
    # methods:
    #
    # avatar_url
    # avatar_extension
    # avatar_styles
    # avatar_is_image?
    # can_process_avatar?
    # It also adds a before processing callback for Paperclip to process the variants if,
    # and only if the attachment is processable.
    # rubocop:disable Metrics/LineLength, Style/TrailingWhitespace
    def manifold_has_attached_file(field, type, styles: {}, convert_options: {}, no_styles: false)
      # Create the style
      final_styles = no_styles ? {} : MANIFOLD_ATTACHMENT_IMAGE_STYLES.merge(styles)
      has_attached_file(
        field,
        styles: MANIFOLD_ATTACHMENT_IMAGE_STYLES.merge(final_styles),
        convert_options: MANIFOLD_ATTACHMENT_IMAGE_CONVERT_OPTIONS.merge(convert_options)
      )

      class_eval <<-RUBY, __FILE__, __LINE__ + 1
  
        validates_attachment_content_type(
          :#{field}, 
          content_type: Rails.configuration.manifold.attachments.validations.#{type}.allowed_mime
        )
  
        validates_attachment_file_name(
          :#{field}, 
          matches: Rails.configuration.manifold.attachments.validations.#{type}.allowed_ext
        )
  
        before_#{field}_post_process :can_process_#{field}_styles?
        
        def #{field}_url
          return nil unless #{field}.present?
          Rails.configuration.manifold.api_url + #{field}.url
        end
  
        def #{field}_extension
          File.extname(#{field}_file_name).delete(".").downcase if #{field}.present?
        end
  
        def #{field}_styles
          is_image = #{field}_is_image?
          styles = #{field}.styles.keys.map do |style|
            value = nil
            if is_image
              value = Rails.configuration.manifold.api_url + #{field}.url(style)
            end
            [style, value]
          end
          styles.push([:original, #{field}_url])
          Hash[styles]
        end
  
        def #{field}_is_image?
          return false unless #{field}.present?
          config = Rails.configuration.manifold.attachments.validations
          !#{field}_content_type.match(Regexp.union(config[:image][:allowed_mime])).nil?          
        end
  
        def can_process_#{field}_styles?
          #{field}_is_image?
        end
      RUBY
    end
    # rubocop:enable Metrics/LineLength, Style/TrailingWhitespace
  end
  # rubocop:enable Metrics/BlockLength
end
