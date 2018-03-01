# Serializes the current User model
class CurrentUserSerializer < UserSerializer

  meta(partial: false)

  attributes :persistent_ui, :class_abilities

  has_many :favorites, serializer: FavoriteSerializer

  def class_abilities
    models_with_authorization.each_with_object({}) do |klass, abilities|
      abilities[klass.name.underscore] = klass.serialized_abilities_for(the_user)
    end
  end

  private

  def the_user
    return current_user unless instance_options.key?(:override_current_user)
    instance_options[:override_current_user]
  end

  def models_with_authorization
    tables = ActiveRecord::Base.connection.tables
    models = tables.map { |t| t.classify.safe_constantize }.compact
    # Statistics is an AR-like model that requires authorization, but it's not backed by
    # a DB table.
    models << Statistics
    # Rails tried to singularize Settings, which is weird because it's a singleton model.
    models << Settings
    models.select { |klass| klass.respond_to? :readable_by? }
  end

end
