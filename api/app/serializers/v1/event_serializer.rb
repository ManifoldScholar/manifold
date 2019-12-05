module V1
  class EventSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :event_type, NilClass
    typed_attribute :event_url, NilClass
    typed_attribute :subject_id, NilClass
    typed_attribute :subject_type, NilClass
    typed_attribute :subject_slug, NilClass
    typed_attribute :subject_title, NilClass
    typed_attribute :subject_subtitle, NilClass
    typed_attribute :attribution_name, NilClass
    typed_attribute :attribution_url, NilClass
    typed_attribute :attribution_identifier, NilClass
    typed_attribute :excerpt, NilClass
    typed_attribute :project_id, NilClass
    typed_attribute :project_slug, NilClass
    typed_attribute :event_title, NilClass
    typed_attribute :event_subtitle, NilClass
    typed_attribute :created_at, NilClass
    typed_attribute :subject_title_formatted, NilClass
  end
end
