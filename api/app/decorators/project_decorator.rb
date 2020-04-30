class ProjectDecorator < ApplicationDecorator
  delegate_all
  decorates_association :texts
  decorates_association :resources
  decorates_association :resource_collections
  decorates_association :comments
  decorates_association :annotations

  def client_url
    Rails.configuration.manifold.url
  end

  def url
    ClientURL.call(:project_show, project_slug: slug)
  end

  def title
    object.title.titleize
  end

  def avatar_url
    if avatar.present?
      avatar_styles[:small_portrait]
    else
      "#{client_url}/static/images/manifold-project-placeholder.jpg"
    end
  end

  def creator_list
    creators.map(&:name).join(", ")
  end

end
