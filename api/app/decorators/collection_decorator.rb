class CollectionDecorator < ApplicationDecorator
  delegate_all
  decorates_association :project
  decorates_association :resources

  def url
    ClientURL.call(:collection_show, project_slug: project.slug, collection_slug: slug)
  end

end
