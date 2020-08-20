class TextExport < ApplicationRecord
  include HasExportKind
  include ExportUploader::Attachment.new(:asset)

  belongs_to :text, inverse_of: :text_exports
  has_many :text_export_statuses, inverse_of: :text_export

  classy_enum_attr :export_kind, allow_blank: false, default: :unknown

  upsert_keys %i[text_id fingerprint]

  scope :by_text, ->(text) { where(text: text) }
  scope :by_fingerprint, ->(fingerprint) { where(fingerprint: fingerprint) }
  scope :epub_v3, -> { by_kind :epub_v3 }
  scope :with_epubcheck_messages, -> { where(arel_integrity_check_message_count("epubcheck").gt(0)) }
  scope :prunable, -> { where(id: TextExportStatus.prunable_export_ids) }

  attribute :integrity_check, :indifferent_hash

  before_validation :populate_integrity_check!

  validates :fingerprint, uniqueness: { scope: %i[text_id export_kind] }

  # @api private
  # @note Used by {ExportUploader}
  # @return [(String, String)]
  def location_identifier
    raise "Cannot derive pretty location" unless text_id? && fingerprint?

    [text_id, fingerprint]
  end

  # @api private
  # @return [void]
  def populate_integrity_check!
    self.integrity_check = build_integrity_check
  end

  private

  # @return [ActiveSupport::HashWithIndifferentAccess{ Symbol => <Hash> }]
  def build_integrity_check
    {}.with_indifferent_access.tap do |h|
      h[:epubcheck] = Array(asset&.metadata&.dig("epubcheck", "messages"))
    end
  end

  class << self
    def arel_integrity_check_message_count(key)
      arel_json_array_length(arel_integrity_check_property(key))
    end

    def arel_integrity_check_property(key)
      arel_infix "->", arel_table[:integrity_check], key, autoquote: true
    end

    # @param [Packaging::EpubV3::BookContext, Packaging::EpubV3::CompiledText, Text] textish
    # @raise [TypeError] if provided an invalid type
    # @return [TextExport]
    def find_or_initialize_for_epub_v3(textish)
      query = by_kind(:epub_v3)

      case textish
      when Packaging::EpubV3::BookContext
        return find_or_initialize_for_epub_v3(textish.compiled_text)
      when Packaging::EpubV3::CompiledText
        query = query.by_text(textish.text).by_fingerprint(textish.fingerprint)
      when Text
        fingerprint = Texts::CalculateFingerprint.run! text: textish

        query = query.by_text(textish).by_fingerprint(fingerprint)
      else
        raise TypeError, "Cannot #{__method__}(#{textish.inspect})"
      end

      query.first_or_initialize
    end
  end
end
