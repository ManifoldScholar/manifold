module ResourceAttributeResets
  extend ActiveSupport::Concern

  def reset_non_image_attributes
    attributes = %w(external_url external_id external_type sub_kind)
    attachments = %w(variant_format_one variant_format_two variant_poster)
    reset_attributes(attributes, attachments)
  end

  def reset_non_audio_attributes
    attributes = %w(external_url external_id external_type sub_kind)
    attachments = %w(high_res variant_thumbnail variant_poster)
    reset_attributes(attributes, attachments)
  end

  def reset_non_pdf_attributes
    attributes = %w(external_url external_id external_type sub_kind)
    attachments = %w(variant_format_one variant_format_two high_res
                     variant_poster)
    reset_attributes(attributes, attachments)
  end

  def reset_non_document_attributes
    reset_file_attributes
  end

  def reset_non_spreadsheet_attributes
    reset_file_attributes
  end

  def reset_non_presentation_attributes
    reset_file_attributes
  end

  def reset_non_file_attributes
    reset_file_attributes
  end

  def reset_non_video_attributes
    external_video? ? reset_non_external_video_attributes : reset_video_attributes
  end

  def reset_non_interactive_attributes
    attributes = %w(external_id external_type)
    attachments = %w(attachment variant_format_one variant_format_two
                     high_res)
    reset_attributes(attributes, attachments)
  end

  def reset_non_link_attributes
    attributes = %w(external_id external_type sub_kind)
    attachments = %w(attachment variant_format_one variant_format_two
                     high_res variant_thumbnail variant_poster)
    reset_attributes(attributes, attachments)
  end

  def reset_file_attributes
    attributes = %w(external_url external_id external_type sub_kind)
    attachments = %w(variant_format_one variant_format_two high_res
                     variant_thumbnail variant_poster)
    reset_attributes(attributes, attachments)
  end

  def reset_non_external_video_attributes
    attributes = %w()
    attachments = %w(attachment high_res variant_poster)
    reset_attributes(attributes, attachments)
  end

  def reset_video_attributes
    attributes = %w(external_url external_id external_type sub_kind)
    attachments = %w(high_res)
    reset_attributes(attributes, attachments)
  end

  def reset_attributes(attributes, attachments)
    attributes.each { |attribute| send("#{attribute}=", nil) }
    attachments.each { |attachment| send("#{attachment}=", nil) }
  end
end
