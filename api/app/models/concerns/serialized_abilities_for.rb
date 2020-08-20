# included in a resource model (one that implements {Authority::Abilities})
module SerializedAbilitiesFor
  extend ActiveSupport::Concern

  class_methods do
    def serialized_abilities_for(user)
      return {} if user.nil?

      authorizer.to_serializable_hash_for(user)
    end
  end

  # @see SerializedAuthorization#to_serializable_hash_for
  # @param [Authority::UserAbilities]
  # @param [{ Symbol => Object }] options
  # @return [{ Symbol => Boolean }]
  def serialized_abilities_for(user, **options)
    return {} if user.nil?

    authorizer.to_serializable_hash_for(user, **options)
  end
end
