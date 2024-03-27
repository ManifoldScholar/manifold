using Refinements::HandleRenamedCollections
# The primary entry point for this subsystem is {PaperclipMigrator.migrate_all!}.
#
# Its intention is to divorce all dependencies on Paperclip itself so that migrations
# will continue to work even after we eventually remove the Paperclip gem.
# rubocop:disable Metrics/MethodLength
# rubocop:disable Style/GuardClause
module PaperclipMigrator
  FIELD_NAMES = %w[file_name file_size content_type updated_at].freeze
  HASH_DATA = ":class/:attachment/:id/:style/:updated_at".freeze
  PATH = ":rails_root/public/system/:class/:attachment/:uuid_partition/:style-:hash.:extension".freeze

  class << self
    # @param [Class] klass
    # @param [Symbol] attachment_name
    # @param [<Symbol>] style_names
    # @param [{ Symbol => Object }] options (see PaperclipMigrator::PseudoAttachment#initialize)
    # @return [Integer] number of records migrated
    def migrate_all!(klass, attachment_name, *style_names, **options)
      PaperclipMigrator::MigrateAll.run!(
        model_klass: klass,
        attachment_name: attachment_name,
        style_names: style_names,
        options: options
      )
    end
  end

  def paperclip_attachment(table, prefix)
    reversible do |dir|
      dir.up do
        add_column table, :"#{prefix}_file_name", :string
        add_column table, :"#{prefix}_content_type", :string
        add_column table, :"#{prefix}_file_size", :integer
        add_column table, :"#{prefix}_updated_at", :timestamp
      end
      dir.down do
        %w(file_name content_type file_size updated_at).each do |suffix|
          remove_column table, :"#{prefix}_#{suffix}"
        end
      end
    end
  end

  module_function :paperclip_attachment

  # @api private
  # @param [ApplicationRecord] instance
  # @param [Symbol] attachment_name
  # @param [<Symbol>] style_names
  # @param [{ Symbol => Object }] options (see PaperclipMigrator::PseudoAttachment#initialize)
  # @return [PaperclipMigrator::PseudoAttachment]
  def attachment_for(instance, attachment_name, *style_names, **options)
    options[:instance] = instance
    options[:attachment_name] = attachment_name
    options[:style_names] = Array(style_names).flatten

    PaperclipMigrator::PseudoAttachment.new(**options)
  end

  module_function :attachment_for

  # @api private
  # @param [ApplicationRecord] instance
  # @param [Symbol] attachment_name
  # @param [<Symbol>] style_names
  # @param [{ Symbol => Object }] options (see PaperclipMigrator::PseudoAttachment#initialize)
  # @return [{ Symbol => { Symbol => Object }}] styles mapped to shrine data objects
  # @return [{ Symbol => Object }] when there is only one style
  def shrine_data_for(instance, attachment_name, *style_names, **options)
    attachment_for(instance, attachment_name, *style_names, **options).to_shrine_data
  end

  module_function :shrine_data_for

  # @api private
  class MigrateAll < ActiveInteraction::Base
    object :model_klass, class: "Class"

    symbol :attachment_name

    array :style_names, default: [] do
      symbol
    end

    hash :options, strip: false, default: {}

    # @return [Integer]
    def execute
      model_klass.reset_column_information

      models_with_paperclip = model_klass.where.not("#{attachment_name}_file_name": nil)

      @counter = 0

      models_with_paperclip.find_each do |instance|
        compose PaperclipMigrator::MigrateRecord, inputs.merge(instance: instance)

        @counter += 1
      end

      @counter
    end
  end

  # @api private
  class MigrateRecord < ActiveInteraction::Base
    include PaperclipMigrator

    object :instance, class: "ApplicationRecord"

    symbol :attachment_name

    array :style_names, default: [] do
      symbol
    end

    hash :options, strip: false, default: {}

    def execute
      # First we convert the data as it exists in paperclip
      shrine_data = shrine_data_for instance, attachment_name, *style_names, options.symbolize_keys

      shrine_data = shrine_data[:original] unless uploader_supports_versions?

      write_data! shrine_data

      # Now we refresh the metadata to ensure it is populated
      shrine_data_with_metadata = uploader.uploaded_file(attachment) do |uploaded_file|
        # We use action: :cache here to populate the sha256 fingerprints
        uploaded_file.refresh_metadata! action: :cache
      end

      write_data! shrine_data_with_metadata

      if attachment.present?
        attachment_upload = uploader_supports_versions? ? "#{attachment_name}_original" : attachment_name

        begin
          instance.__send__(attachment_upload).read 1024
        rescue StandardError => e
          errors.add :base, "There was a problem testing reading the file: #{e.message}"
        end
      else
        errors.add :base, "did not add attachment properly"
      end

      attachment
    end

    def attacher
      @attacher ||= instance.__send__(:"#{attachment_name}_attacher")
    end

    def attachment_data
      @attachment_data ||= :"#{attachment_name}_data"
    end

    def attachment
      instance.__send__ attachment_name
    end

    def write_data!(data)
      instance.__send__("#{attachment_data}=", JSON.parse(data.to_json))
      instance.save! validate: false, touch: false
    end

    def uploader
      @uploader ||= attacher.shrine_class
    end

    def uploader_supports_versions?
      uploader.respond_to? :version_names
    end
  end

  # This class allows a model's paperclip fields to be
  # transformed into a shrine data hash
  # @api private
  class PseudoAttachment
    attr_reader :attachment_name, :attachment_fields, :default_style, :instance, :interpolated_values, :style_names, :hashes, :paths

    def initialize(instance:, attachment_name:, style_names: [], default_style: :original)
      @base_path = Shrine.storages[:store].directory
      @attachment_name = attachment_name
      @instance = instance
      @default_style = default_style
      @style_names = Array(style_names).map(&:to_sym).flatten | [default_style.to_sym]

      @attachment_fields = fetch_attachment_fields

      raise "called on a non-persisted entity" unless instance.persisted?

      @interpolated_values = @attachment_fields.merge(
        attachment: @attachment_name.to_s.pluralize,
        class: @instance.is_a?(Settings) ? "settings" : instance.model_name.route_key,
        extension: fetch_extension,
        id: instance.id,
        rails_root: Rails.root,
        updated_at: @attachment_fields[:updated_at].to_i,
        uuid_partition: build_uuid_partition
      ).symbolize_keys

      @hashes = @style_names.each_with_object({}.with_indifferent_access) do |style, h|
        h[style] = build_hash_for(style)
      end

      @paths = @style_names.each_with_object({}.with_indifferent_access) do |style, h|
        h[style] = Pathname.new interpolates(PATH, hash: @hashes.fetch(style), style: style)
      end
    end

    def has_additional_styles?
      @style_names.many?
    end

    # @return [{ Symbol => { Symbol => Object }}] styles mapped to shrine data objects
    # @return [{ Symbol => Object }] when there is only one style
    def to_shrine_data
      style_names.each_with_object({}) do |style_name, h|
        h[style_name] = shrine_data_for(style_name)
      end.compact.tap do |h|
        return h[default_style] unless has_additional_styles?
      end
    end

    private

    def build_hash_for(style)
      digest = OpenSSL::Digest.new("SHA1")
      data   = build_hash_data_for(style)
      OpenSSL::HMAC.hexdigest(digest, hash_secret, data)
    end

    def build_hash_data_for(style)
      interpolates HASH_DATA, style: style
    end

    def build_uuid_partition
      instance.id.to_s[0..2].scan(/\w/).join("/".freeze)
    end

    # Fetch the original attachment fields from paperclip columns
    def fetch_attachment_fields
      FIELD_NAMES.each_with_object({}.with_indifferent_access) do |field_name, h|
        h[field_name] = instance.read_attribute "#{attachment_name}_#{field_name}"
      end
    end

    def fetch_extension
      File.extname(@attachment_fields[:file_name]).to_s.sub(/\A\./, "")
    end

    def hash_secret
      ENV["RAILS_SECRET_KEY"]
    end

    # @param [String] pattern
    # @param [{ Symbol => Object }] values
    # @return [String]
    def interpolates(pattern, **values)
      merged_values = @interpolated_values.merge(values)

      pattern.gsub(/(:\w+)/) do |key|
        normalized_key = key.sub(/\A:/, "").to_sym

        merged_values.fetch(normalized_key)
      end
    end

    def shrine_data_for(style)
      hash = @hashes.fetch(style)

      original_path = @paths.fetch(style)

      relative_path = original_path.relative_path_from(@base_path)

      unless original_path.exist?
        if style == default_style
          raise "Could not find #{instance.class} #{instance.id} #{style} #{attachment_name} at #{original_path}"
        else
          return nil
        end
      end

      {
        storage: :store,
        id: relative_path.to_s,
        metadata: {
          paperclip_hash: hash,
          original_paperclip_path: original_path.realpath.to_s
        }
      }.tap do |h|
        if style == default_style
          h[:metadata][:size] = attachment_fields[:file_size]
          h[:metadata][:filename] = attachment_fields[:file_name]
          h[:metadata][:mime_type] = attachment_fields[:content_type]
        end
      end
    end
  end
end
# rubocop:enable Style/GuardClause
# rubocop:enable Metrics/MethodLength
