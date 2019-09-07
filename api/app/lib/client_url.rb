module ClientURL
  mattr_accessor :map do
    ClientURL::Map.new
  end

  class << self
    delegate :call, to: :map
  end

  map.add :subscriptions, "/subscriptions"
  map.add :unsubscribe, "/unsubscribe/{token}"
  map.add :reader_text, "/read/{text_slug}"
  map.add :reader_annotation,
          "/read/{text_slug}/section/{text_section_id}\#{annotation_anchor}"
  map.add :project_show, "/projects/{project_slug}"
  map.add :resource_collection_show,
          "/projects/{project_slug}/resource-collection/{resource_collection_slug}"
  map.add :resource_show, "/projects/{project_slug}/resource/{resource_slug}"
  map.add :join_reading_group, "/my/groups/?join={invitation_code}"

  # Usage:
  # ClientURL.call(:text_show, text_slug: 'foo')
end
