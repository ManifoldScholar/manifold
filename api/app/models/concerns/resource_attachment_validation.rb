module ResourceAttachmentValidation
  extend ActiveSupport::Concern

  include Attachments

  def validate_image_fields
    errors.add(:attachment, "image is required") unless attachment.present?
    errors.add(:attachment, "is invalid image file") unless attachment_is_image?
    errors.empty?
  end

  def validate_audio_fields
    errors.add(:attachment, "audio is required") unless attachment.present?
    errors.add(:attachment, "is invalid audio file") unless attachment_is_audio?
    errors.empty?
  end

  def validate_video_fields
    errors.add(:external_url, "can't be blank") unless external_url.present? || attachment.present?
    errors.add(:external_type, "is required") unless external_type.present? || attachment.present?
    errors.add(:attachment, "video is required") unless attachment.present? || (external_url.present? && external_type.present?)
    errors.add(:attachment, "is invalid video file") unless attachment_is_video?
    errors.empty?
  end

  def validate_pdf_fields
    errors.add(:attachment, "pdf is required") unless attachment.present?
    errors.add(:attachment, "is invalid pdf file") unless attachment_is_pdf?
    errors.empty?
  end

  def validate_document_fields
    errors.add(:attachment, "document is required") unless attachment.present?
    errors.add(:attachment, "is invalid document file") unless attachment_is_word_document? || attachment_is_plain_text?
    errors.empty?
  end

  def validate_spreadsheet_fields
    errors.add(:attachment, "spreadsheet is required") unless attachment.present?
    errors.add(:attachment, "is invalid spreadsheet file") unless attachment_is_excel?
    errors.empty?
  end

  def validate_presentation_fields
    errors.add(:attachment, "presentation is required") unless attachment.present?
    errors.add(:attachment, "is invalid presentation file") unless attachment_is_powerpoint?
    errors.empty?
  end

  def validate_link_fields
    errors.add(:external_url, "can't be blank") if external_url.blank?
    errors.empty?
  end

end
