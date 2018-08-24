class AnnotationDecorator < ApplicationDecorator
  delegate_all
  decorates_association :text

  def reader_url
    ClientURL.call(:reader_annotation,
                   text_slug: text.slug,
                   text_section_id: text_section_id,
                   annotation_anchor: "annotation-#{id}")
  end

end
