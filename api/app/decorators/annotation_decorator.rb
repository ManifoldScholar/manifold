class AnnotationDecorator < ApplicationDecorator
  delegate_all
  decorates_association :text

  def has_text?
    text_section.present? && text.present?
  end

  def text_title
    return nil unless has_text?

    text.title
  end

  def reader_url
    return "" if !text_section || !text

    ClientURL.call(:reader_annotation,
                   text_slug: text.slug,
                   text_section_id: text_section_id,
                   annotation_anchor: "annotation-#{id}")
  end
  alias subject_url reader_url

end
