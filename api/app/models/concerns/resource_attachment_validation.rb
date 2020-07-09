module ResourceAttachmentValidation
  extend ActiveSupport::Concern

  include Attachments
  def validate_image_fields
    errors.add(:attachment, "image is required") unless attachment.present?
    errors.add(:attachment, "is invalid image file") if attachment.present? && !attachment_is_image?
    errors.empty?
  end

  def validate_audio_fields
    errors.add(:attachment, "audio is required") unless attachment.present?
    errors.add(:attachment, "is invalid audio file") if attachment.present? && !attachment_is_audio?
    errors.empty?
  end

  # rubocop:disable Metrics/AbcSize
  def validate_video_fields
    if external_video?
      errors.add(:external_id, "can't be blank") unless external_id.present?
      errors.add(:external_type, "is required") unless external_type.present?
    else
      errors.add(:attachment, "video is required") unless attachment.present?
      errors.add(:attachment, "is invalid video file") if attachment.present? && !attachment_is_video?
    end
    errors.empty?
  end
  # rubocop:enable Metrics/AbcSize

  def validate_pdf_fields
    errors.add(:attachment, "pdf is required") unless attachment.present?
    errors.add(:attachment, "is invalid pdf file") if attachment.present? && !attachment_is_pdf?
    errors.empty?
  end

  def validate_document_fields
    errors.add(:attachment, "document is required") unless attachment.present?
    errors.add(:attachment, "is invalid document file") if attachment.present? && !attachment_is_text_document?
    errors.empty?
  end

  def validate_spreadsheet_fields
    errors.add(:attachment, "spreadsheet is required") unless attachment.present?
    errors.add(:attachment, "is invalid spreadsheet file") if attachment.present? && !attachment_is_spreadsheet?
    errors.empty?
  end

  def validate_presentation_fields
    errors.add(:attachment, "presentation is required") unless attachment.present?
    errors.add(:attachment, "is invalid presentation file") if attachment.present? && !attachment_is_presentation?
    errors.empty?
  end

  def validate_file_fields
    errors.add(:attachment, "file is required") unless attachment.present?
    errors.empty?
  end

  def validate_interactive_fields
    errors.add(:external_url, "can't be blank") unless external_url.present?
    errors.empty?
  end

  def validate_link_fields
    errors.add(:external_url, "can't be blank") if external_url.blank?
    errors.empty?
  end
end
