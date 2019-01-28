class ResourceCollectionDecorator < ApplicationDecorator
  delegate_all
  decorates_association :project
  decorates_association :resources

  def url
    ClientURL.call(:resource_collection_show,
                   project_slug: project.slug,
                   resource_collection_slug: slug)
  end

end
