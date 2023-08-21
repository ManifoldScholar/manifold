module Attachments
  extend ActiveSupport::Concern

  include ActiveSupport::Configurable

  included do
    config.shrine_attachment_configurations ||= {}.with_indifferent_access

    delegate :shrine_attachment_configurations, :shrine_configuration_for, :shrine_options_for,
             :shrine_attachment_type_for, :shrine_attachment_style_keys_for, :shrine_has_versions?,
             to: :class
  end

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
      thumbnail: "#{MED / RATIO}x#{MED}^",
      extent: MED_REL.to_s
    },
    large_landscape: {
      convert: "jpg",
      background: "none",
      gravity: "north",
      thumbnail: "#{LRG}x#{LRG / RATIO}^",
      extent: "#{LRG}x#{LRG / RATIO}^"
    }
  }.freeze

  ALPHA_STYLES = BASE_STYLES.transform_values do |base_style|
    base_style.merge(convert: "png").freeze
  end.freeze

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

  TYPE_MATCHERS = CONFIG.each_with_object({}.with_indifferent_access) do |(type, defn), h|
    h[type] = Attachments::TypeMatcher.new type, **defn.as_json.deep_symbolize_keys
  end.freeze

  def has_present_shrine_attachment?(attachment_name)
    public_send(attachment_name).present?
  end

  def has_processed_shrine_attachment?(attachment_name)
    shrine_attacher_for(attachment_name).stored?
  end

  # @return [Hash]
  def manifold_attachment_alpha_styles
    ALPHA_STYLES
  end

  # @return [Hash]
  def manifold_attachment_image_styles
    BASE_STYLES
  end

  # @return [Hash]
  def manifold_favicon_styles
    FAVICON_STYLES
  end

  def shrine_attacher_for(attachment_name)
    public_send(:"#{attachment_name}_attacher")
  end

  # @return [<Attachments::Proxy>]
  def shrine_attachment_proxies
    shrine_attachment_configurations.map do |(name, configuration)|
      Attachments::Proxy.new name, configuration, record: self, uploaded_file: shrine_original_for(name)
    end
  end

  # Get the URI to placeholder images for attachments.
  #
  # @param [#to_s] style
  # @return [String]
  def shrine_image_placeholder_for(style)
    "/static/images/attachment_placeholders/#{style}.png"
  end

  # @param [String, Symbol] attachment_name
  # @yieldparam [AttachmentUploader::UploadedFile]
  # @return [AttachmentUploader::UploadedFile]
  def shrine_original_for(attachment_name)
    original = public_send(attachment_name)
    block_given? && original ? yield(original) : original
  end

  # @param [String, Symbol] attachment_name
  def shrine_show_placeholder_for?(attachment_name)
    return false unless shrine_upload_matches_type?(shrine_original_for(attachment_name), type: :image)

    true
  end

  # @param [String, Symbol] attachment_name
  # @return [{ Symbol => { Symbol => Integer, nil }, nil }]
  def shrine_meta_for(attachment_name)
    shrine_style_map_for attachment_name do |uploaded_file, _style|
      uploaded_file&.as_dimensions_hash
    end
  end

  # @param [String, Symbol] attachment_name
  # @return [{ Symbol => String, nil }]
  def shrine_styles_for(attachment_name)
    shrine_style_map_for attachment_name do |uploaded_file, style|
      if uploaded_file.present?
        uploaded_file.url
      elsif shrine_show_placeholder_for?(attachment_name)
        shrine_image_placeholder_for(style)
      end
    end
  end

  # @api private
  # @param [Symbol, String] attachment_name
  # @yield [uploaded_file, style_key]
  # @yieldparam [AttachmentUploader::UploadedFile] uploaded_file
  # @yieldparam [Symbol] style_key
  # @yieldreturn [Object]
  # @return [{ Symbol => Object }]
  def shrine_style_map_for(attachment_name)
    return {} unless has_present_shrine_attachment?(attachment_name)

    style_keys = shrine_attachment_style_keys_for(attachment_name) | [:original]

    style_keys.each_with_object({}) do |style_key, h|
      version = shrine_version_for attachment_name, style_key

      h[style_key] = yield version, style_key
    end
  end

  # Validates that the uploaded file matches the given type,
  # currently based on extension.
  #
  # @see Attachments::TypeMatcher#call
  # @param [AttachmentUploader::UploadedFile] attachment
  # @param [Symbol] type
  def shrine_upload_matches_type?(uploaded_file, type:)
    TYPE_MATCHERS.fetch(type).call(uploaded_file)
  end

  # @param [Symbol, String] attachment_name
  # @param [Symbol] style
  # @return [AttachmentUploader::UploadedFile, nil]
  def shrine_version_for(attachment_name, style)
    return shrine_original_for(attachment_name) if style == :original

    derivatives = public_send("#{attachment_name}_derivatives")
    return nil unless derivatives&.key?(style)

    derivatives[style]
  end
  # rubocop:enable

  # @param [String, Symbol] attachment_name
  def validate_content_type_for?(attachment_name)
    shrine_configuration_for(attachment_name).validate_content_type
  end

  class_methods do
    # @!attribute [r] shrine_attachment_configurations
    # @!scope class
    # @return [ActiveSupport::HashWithIndifferentAccess{Symbol, String => Attachments::Configuration}]
    def shrine_attachment_configurations
      config.shrine_attachment_configurations
    end

    # @!attribute [r] shrine_attachment_modules
    # @!scope class
    # @return [<AttachmentUploader::Attachment>]
    def shrine_attachment_modules
      ancestors.select { |mod| mod.is_a?(Shrine::Attachment) }
    end

    # @param [Symbol, String] attachment_name
    # @return [Attachments::Configuration]
    def shrine_configuration_for(attachment_name)
      shrine_attachment_configurations.fetch(attachment_name)
    end

    # @param [Symbol, String] attachment_name
    # @return [{ Symbol => Object }]
    def shrine_options_for(attachment_name)
      shrine_configuration_for(attachment_name).options
    end

    # @param [Symbol, String] attachment_name
    # @return [Symbol]
    def shrine_attachment_type_for(attachment_name)
      shrine_configuration_for(attachment_name).type
    end

    # @param [Symbol, String] attachment_name
    # @return [<Symbol>]
    def shrine_attachment_style_keys_for(attachment_name)
      return [] unless shrine_has_versions?(attachment_name)

      case shrine_attachment_type_for(attachment_name)
      when :favicon then FAVICON_STYLES.keys
      else
        BASE_STYLES.keys
      end
    end

    # @param [Symbol, String] attachment_name
    def shrine_has_versions?(attachment_name)
      shrine_configuration_for(attachment_name).has_versions?
    end

    # Sets up Shrine attachment configuration for `field`. The `type` argument
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
    def manifold_has_attached_file(field, type, no_styles: false, validate_content_type: true, backgrounding: true)
      validations = CONFIG.fetch(type).with_indifferent_access

      config = Attachments::Configuration.new(
        field: field, type: type,
        no_styles: no_styles, validate_content_type: validate_content_type,
        validations: validations,
        backgrounding: backgrounding
      )

      add_shrine_attachment_configuration! config

      include AttachmentUploader::Attachment.new(field)

      delegate :alt_text, to: field, prefix: true, allow_nil: true
    end

    private

    # @param [Attachments::Configuration] configuration
    # @return [void]
    def add_shrine_attachment_configuration!(configuration)
      config.shrine_attachment_configurations = shrine_attachment_configurations.merge(configuration.field => configuration)
    end
  end
end
# rubocop:enable
