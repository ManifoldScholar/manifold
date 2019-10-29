# Model concern that tracks who created a record
# rubocop:disable Metrics/LineLength, Layout/TrailingWhitespace
module Attachments
  extend ActiveSupport::Concern

  CONFIG = Rails.configuration.manifold.attachments.validations

  RATIO = 1.6
  SMALL = 320
  SMALL_REL = (SMALL / RATIO).to_i
  MED = 640
  MED_REL = (MED / RATIO).to_i
  LRG = 1280
  LRG_REL = (LRG / RATIO).to_i

  BASE_STYLES = {
    small: {
      resize: "#{SMALL}x#{SMALL}",
      convert: "jpg",
      background: "none",
      gravity: "north"
    },
    small_square: {
      convert: "jpg",
      background: "none",
      gravity: "north",
      thumbnail: "#{SMALL}x#{SMALL}^",
      extent: "#{SMALL}x#{SMALL}"
    },
    small_landscape: {
      convert: "jpg",
      background: "none",
      gravity: "north",
      thumbnail: "#{SMALL}x#{SMALL_REL}^",
      extent: "#{SMALL}x#{SMALL_REL}"
    },
    small_portrait: {
      convert: "jpg",
      background: "none",
      gravity: "north",
      thumbnail: "#{SMALL_REL}x#{SMALL}^",
      extent: "#{SMALL_REL}x#{SMALL}"
    },
    medium: {
      resize: "#{MED}x#{MED}",
      convert: "jpg",
      background: "none",
      gravity: "north"
    },
    medium_square: {
      convert: "jpg",
      background: "none",
      gravity: "north",
      thumbnail: "#{MED}x#{MED}^",
      extent: "#{MED}x#{MED}"
    },
    medium_landscape: {
      convert: "jpg",
      background: "none",
      gravity: "north",
      thumbnail: "#{MED}x#{MED_REL}^",
      extent: "#{MED}x#{MED_REL}"
    },
    medium_portrait: {
      convert: "jpg",
      background: "none",
      gravity: "north",
      thumbnail: "#{MED / 1.6}x#{MED}^",
      extent: MED_REL.to_s
    },
    large_landscape: {
      convert: "jpg",
      background: "none",
      gravity: "north",
      thumbnail: "#{LRG}x#{LRG / 1.6}^",
      extent: "#{LRG}x#{LRG / 1.6}^"
    }
  }.freeze

  FAVICON_STYLES = {
    small: {
      convert: "png",
      background: "none",
      gravity: "north",
      thumbnail: "16x16^",
      extent: "16x16"
    },
    medium: {
      convert: "png",
      background: "none",
      gravity: "north",
      thumbnail: "32x32^",
      extent: "32x32"
    },
    large: {
      convert: "png",
      background: "none",
      gravity: "north",
      thumbnail: "96x96^",
      extent: "96x96"
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

    def manifold_has_attached_file(field, type, no_styles: false, validate_content_type: true)
      # Create the style

      include AttachmentUploader::Attachment.new(field)

      class_eval <<-RUBY, __FILE__, __LINE__ + 1
      
        def #{field}_options
          { 
            type: :#{type},
            no_styles: #{no_styles},
            validate_content_type: #{validate_content_type}
          }
        end
      
        def manifold_attachment_image_styles
          return BASE_STYLES
        end

        def manifold_attachment_alpha_styles
          BASE_STYLES.transform_values do |base_style|
            base_style.merge(convert: "png")
          end
        end

        def manifold_favicon_styles
          return FAVICON_STYLES
        end

        def style_keys
          return FAVICON_STYLES.keys if :#{type} == :favicon
          BASE_STYLES.keys
        end

        def #{field}_processed?
          #{field}_attacher.stored?
        end 

        def show_#{field}_placeholder?
          return false unless #{field}_is_image?
          return false if #{field}_processed?
          true
        end

        def #{field}_placeholder(style)
          "/static/images/attachment_placeholders/\#{style}.png"
        end

        def #{field}_versions?
          #{field}.is_a? Hash
        end
  
        def #{field}_extension
          #{field}_original(&:extension)
        end

        def #{field}_file_name
          #{field}_original(&:original_filename)
        end

        def #{field}?
          #{field}.present?
        end

        def #{field}_url
          #{field}_original(&:url)
        end

        def #{field}_content_type
          #{field}_original(&:mime_type)
        end

        def #{field}_file_size
          #{field}_original(&:size)
        end

        def #{field}_original
          return nil unless #{field}?
        
          original =
            if #{field}_attacher.cached?
              #{field}
            elsif #{field}_attacher.stored?
              #{field}[:original]
            end
        
          block_given? ? yield(original) : original
        end

        def #{field}_meta
          return {} unless #{field}?
          versions = style_keys.map do |version|
            if #{field}_data&.key? version.to_s
              value = { width: #{field}[version].width, height: #{field}[version].height }
            else 
              value = nil
            end
            [version, value]
          end
          original = #{field}_original
          versions.push([:original, { width: original.width, height: original.height }])
          Hash[versions]
        end
  
        def #{field}_styles
          original = #{field}_original&.url
          styles = style_keys.map do |style|
            value = if #{field}_data&.key? style.to_s
                      #{field}[style].url
                    elsif show_#{field}_placeholder?
                      #{field}_placeholder(style)
                    else
                      nil
                    end
            [style, value]
          end
          styles.push([:original, original])
          Hash[styles]
        end
  
        def #{field}_is_image?
          return false unless #{field}?
          attachment = #{field}_original
          !attachment.mime_type.match(Regexp.union(CONFIG[:image][:allowed_mime])).nil?
          !attachment.extension.match(Regexp.union(CONFIG[:image][:allowed_ext])).nil?
        end

        def #{field}_is_video?
          return false unless #{field}?
          attachment = #{field}_original
          !attachment.mime_type.match(Regexp.union(CONFIG[:video][:allowed_mime])).nil?  
          !attachment.extension.match(Regexp.union(CONFIG[:video][:allowed_ext])).nil?
        end
      
        def #{field}_is_audio?
          return false unless #{field}?
          attachment = #{field}_original
          !attachment.mime_type.match(Regexp.union(CONFIG[:audio][:allowed_mime])).nil?  
          !attachment.extension.match(Regexp.union(CONFIG[:audio][:allowed_ext])).nil?
        end
      
        def #{field}_is_spreadsheet?
          return false unless #{field}?
          attachment = #{field}_original
          !attachment.mime_type.match(Regexp.union(CONFIG[:spreadsheet][:allowed_mime])).nil?  
          !attachment.extension.match(Regexp.union(CONFIG[:spreadsheet][:allowed_ext])).nil?
        end
      
        def #{field}_is_text_document?
          return false unless #{field}?
          attachment = #{field}_original
          !attachment.mime_type.match(Regexp.union(CONFIG[:text_document][:allowed_mime])).nil?  
          !attachment.extension.match(Regexp.union(CONFIG[:text_document][:allowed_ext])).nil?
        end
      
        def #{field}_is_presentation?
          return false unless #{field}?
          attachment = #{field}_original
          !attachment.mime_type.match(Regexp.union(CONFIG[:presentation][:allowed_mime])).nil?  
          !attachment.extension.match(Regexp.union(CONFIG[:presentation][:allowed_ext])).nil?
        end
      
        def #{field}_is_pdf?
          return false unless #{field}.present?
          attachment = #{field}_original
          !attachment.mime_type.match(Regexp.union(CONFIG[:pdf][:allowed_mime])).nil?  
          !attachment.extension.match(Regexp.union(CONFIG[:pdf][:allowed_ext])).nil?
        end

      RUBY
    end
  end
  # rubocop:enable Metrics/BlockLength
end
# rubocop:enable Metrics/LineLength, Layout/TrailingWhitespace
