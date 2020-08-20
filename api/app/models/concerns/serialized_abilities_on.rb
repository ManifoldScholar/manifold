# Included in a user-type model (one that implements {Authority::UserAbilities})
module SerializedAbilitiesOn
  extend ActiveSupport::Concern

  # @see SerializedAbilitiesFor#serialized_abilities_for
  # @param [Authority::Abilities] resource
  # @param [{ Symbol => Object }] options
  # @return [{ Symbol => Boolean }]
  def serialized_abilities_on(resource, **options)
    resource.serialized_abilities_for(self, **options)
  end
end
