class CommentDecorator < ApplicationDecorator
  delegate_all

  def title
    if on_resource?
      subject_title
    elsif on_annotation?
      subject_text_title
    end
  end

  def subject_url
    if on_resource?
      ClientURL.call(:resource_show, project_slug: project.slug, resource_slug: subject.slug)
    elsif on_annotation?
      ClientURL.call(:reader_annotation, text_slug: subject.text.slug,
                     text_section_id: subject.text_section_id,
                     annotation_anchor: "annotation-#{subject.id}")
    end
  end

end
