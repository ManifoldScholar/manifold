# Model concern that tracks who created a record
# rubocop:disable Metrics/LineLength, Layout/TrailingWhitespace
module Attachments
  extend ActiveSupport::Concern

  RATIO = 1.6
  SMALL = 320
  SMALL_REL = (SMALL / RATIO).to_i
  MED = 640
  MED_REL = (MED / RATIO).to_i
  LRG = 1280
  LRG_REL = (LRG / RATIO).to_i

  BASE_STYLES = {
    small: {
      geometry: "#{SMALL}x#{SMALL}",
      format: :jpg
    },
    small_square: {
      geometry: "",
      format: :jpg,
      convert_options: "-background none -gravity north -thumbnail #{SMALL}x#{SMALL}^ -extent #{SMALL}x#{SMALL}"
    },
    small_landscape: {
      geometry: "",
      format: :jpg,
      convert_options: "-background none -gravity north -thumbnail #{SMALL}x#{SMALL_REL}^ -extent #{SMALL}x#{SMALL_REL}"
    },
    small_portrait: {
      geometry: "",
      format: :jpg,
      convert_options: "-background none -gravity north -thumbnail #{SMALL_REL}x#{SMALL}^ -extent #{SMALL_REL}x#{SMALL}"
    },
    medium: {
      geometry: "#{MED}x#{MED}",
      format: :jpg
    },
    medium_square: {
      geometry: "",
      format: :jpg,
      convert_options: "-background none -gravity north -thumbnail #{MED}x#{MED}^ -extent #{MED}x#{MED}"
    },
    medium_landscape: {
      geometry: "",
      format: :jpg,
      convert_options: "-background none -gravity north -thumbnail #{MED}x#{MED_REL}^ -extent #{MED}x#{MED_REL}"
    },
    medium_portrait: {
      geometry: "",
      format: :jpg,
      convert_options: "-background none -gravity north -thumbnail #{MED / 1.6}x#{MED}^ -extent #{MED_REL}"
    },
    large_landscape: {
      geometry: "",
      format: :jpg,
      convert_options: "-background none -gravity north -thumbnail #{LRG}x#{LRG / 1.6}^ -extent #{LRG}x#{LRG / 1.6}"
    }
  }.freeze

  # rubocop:disable Metrics/BlockLength
  class_methods do
    # Sets up paperclip attachment configuration for `field`. The `type` argument
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
    def manifold_has_attached_file(field, type, styles: {}, no_styles: false)
      # Create the style

      has_attached_file(
        field,
        styles: ->(a) { a.instance.send("#{field}_style_configuration", styles, no_styles) }
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
        after_#{field}_post_process :update_#{field}_meta
    
        def manifold_attachment_image_styles
          return BASE_STYLES
        end

        def manifold_attachment_alpha_styles
          BASE_STYLES.transform_values do |base_style|
            base_style.merge(format: :png)
          end
        end

        def #{field}_style_configuration(additional_styles = {}, no_styles = false)
          return {} if no_styles
          return manifold_attachment_alpha_styles if #{field}_is_pdf? ||
                                                       #{field}_extension == "png" ||
                                                       #{field}_extension == "gif"
          manifold_attachment_image_styles
          # Debugger.add_breakpoint(__FILE__, __LINE__ + 1)
        end

        def #{field}_url
          return nil unless #{field}.present?
          (Rails.configuration.manifold.api_url || "") + #{field}.url
        end
  
        def #{field}_extension
          File.extname(#{field}_file_name).delete(".").downcase if #{field}.present?
        end

        def update_#{field}_meta
          return unless has_attribute?("#{field}_meta")
          meta = {}
          tempfile = #{field}.queued_for_write[:original]
          if tempfile
            geometry = Paperclip::Geometry.from_file(tempfile)
            dimensions = {height: geometry.height.to_i, width: geometry.width.to_i}
            meta[:original] = dimensions
          end
          self.#{field}_meta = meta
        end
  
        def #{field}_styles
          styles = #{field}.styles.keys.map do |style|
            if #{field}.url(style).present? && can_process_#{field}_styles?
              value = (Rails.configuration.manifold.api_url || "") + #{field}.url(style)
            else 
              value = nil
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

        def #{field}_is_video?
          return false unless #{field}.present?
          config = Rails.configuration.manifold.attachments.validations
          !#{field}_content_type.match(Regexp.union(config[:video][:allowed_mime])).nil?  
        end
      
        def #{field}_is_audio?
          return false unless #{field}.present?
          config = Rails.configuration.manifold.attachments.validations
          !#{field}_content_type.match(Regexp.union(config[:audio][:allowed_mime])).nil?  
        end
      
        def #{field}_is_excel?
          return false unless #{field}.present?
          config = Rails.configuration.manifold.attachments.validations
          !#{field}_content_type.match(Regexp.union(config[:excel][:allowed_mime])).nil?  
        end
      
        def #{field}_is_text_document?
          return false unless #{field}.present?
          config = Rails.configuration.manifold.attachments.validations
          !#{field}_content_type.match(Regexp.union(config[:text_document][:allowed_mime])).nil?  
        end
      
        def #{field}_is_powerpoint?
          return false unless #{field}.present?
          config = Rails.configuration.manifold.attachments.validations
          !#{field}_content_type.match(Regexp.union(config[:powerpoint][:allowed_mime])).nil?  
        end
      
        def #{field}_is_pdf?
          return false unless #{field}.present?
          config = Rails.configuration.manifold.attachments.validations
          !#{field}_content_type.match(Regexp.union(config[:pdf][:allowed_mime])).nil?  
        end
  
        def can_process_#{field}_styles?
          return false if Rails.env.test?
          return false if #{field}.size > 200000000
          (#{field}_is_image? || #{field}_is_pdf?)
        end

      RUBY
    end
  end
  # rubocop:enable Metrics/BlockLength
end
# rubocop:enable Metrics/LineLength, Layout/TrailingWhitespace
