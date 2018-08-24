module ClientURL
  mattr_accessor :map do
    ClientURL::Map.new
  end

  class << self
    delegate :call, to: :map
  end

  map.add :reader_text, "/read/{text_slug}"
  map.add :reader_annotation,
          "/read/{text_slug}/section/{text_section_id}\#{annotation_anchor}"
  map.add :project_show, "/project/{project_slug}"
  map.add :collection_show, "/projects/{project_slug}/collection/{collection_slug}"
  map.add :resource_show, "/projects/{project_slug}/resource/{resource_slug}"

  # Usage:
  # ClientURL.call(:text_show, text_slug: 'foo')
end
