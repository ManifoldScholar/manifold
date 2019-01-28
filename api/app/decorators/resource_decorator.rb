class ResourceDecorator < ApplicationDecorator
  delegate_all
  decorates_association :resource_collection
  decorates_association :project

  def url
    ClientURL.call(:resource_show, project_slug: project.slug, resource_slug: slug)
  end

end
