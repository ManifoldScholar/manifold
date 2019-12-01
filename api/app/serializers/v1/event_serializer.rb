module V1
  class EventSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    attributes :event_type,
               :event_url,
               :subject_id,
               :subject_type,
               :subject_slug,
               :subject_title,
               :subject_subtitle,
               :attribution_name,
               :attribution_url,
               :attribution_identifier,
               :excerpt,
               :project_id,
               :project_slug,
               :event_title,
               :event_subtitle,
               :created_at,
               :subject_title_formatted
  end
end
