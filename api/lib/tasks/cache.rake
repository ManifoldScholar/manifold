namespace :manifold do
  namespace :cache do
    desc "Prime Manifold caches"
    task prime: :environment do
      Manifold::Rake.logger.info("Caching formatted attribute: event.subject_title")
      Event.prime_formatted_attribute_caches_for_subject_title
      Manifold::Rake.logger.info("Caching formatted attribute: feature.header")
      Feature.prime_formatted_attribute_caches_for_header
      Manifold::Rake.logger.info("Caching formatted attribute: feature.subheader")
      Feature.prime_formatted_attribute_caches_for_subheader
      Manifold::Rake.logger.info("Caching formatted attribute: feature.body")
      Feature.prime_formatted_attribute_caches_for_body
      Manifold::Rake.logger.info("Caching formatted attribute: page.body")
      Page.prime_formatted_attribute_caches_for_body
      Manifold::Rake.logger.info("Caching formatted attribute: project.description")
      Project.prime_formatted_attribute_caches_for_description
      Manifold::Rake.logger.info("Caching formatted attribute: project.subtitle")
      Project.prime_formatted_attribute_caches_for_subtitle
      Manifold::Rake.logger.info("Caching formatted attribute: project.image_credits")
      Project.prime_formatted_attribute_caches_for_image_credits
      Manifold::Rake.logger.info("Caching formatted attribute: project.restricted_access_body")
      Project.prime_formatted_attribute_caches_for_restricted_access_body
      Manifold::Rake.logger.info("Caching formatted attribute: project.title")
      Project.prime_formatted_attribute_caches_for_title
      Manifold::Rake.logger.info("Caching formatted attribute: resource.description")
      Resource.prime_formatted_attribute_caches_for_description
      Manifold::Rake.logger.info("Caching formatted attribute: resource.title")
      Resource.prime_formatted_attribute_caches_for_title
      Manifold::Rake.logger.info("Caching formatted attribute: resource.caption")
      Resource.prime_formatted_attribute_caches_for_caption
      Manifold::Rake.logger.info("Caching formatted attribute: resource_collection.title")
      ResourceCollection.prime_formatted_attribute_caches_for_title
      Manifold::Rake.logger.info("Caching formatted attribute: resource_collection.description")
      ResourceCollection.prime_formatted_attribute_caches_for_description
      Manifold::Rake.logger.info("Caching formatted attribute: settings.copyright")
      Settings.prime_formatted_attribute_caches_for_copyright
      Manifold::Rake.logger.info("Caching formatted attribute: settings.restricted_access_body")
      Settings.prime_formatted_attribute_caches_for_restricted_access_body
      Manifold::Rake.logger.info("Caching formatted attribute: text.description")
      Text.prime_formatted_attribute_caches_for_description
      Manifold::Rake.logger.info("Caching formatted attribute: text_title.value")
      TextTitle.prime_formatted_attribute_caches_for_value
    end
  end
end
