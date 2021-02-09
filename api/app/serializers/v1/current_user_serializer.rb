module V1
  class CurrentUserSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::UserAttributes

    set_type :user

    typed_attribute :persistent_ui, Types::Serializer::PersistentUI do |object, _params|
      object.persistent_ui.as_json
    end

    typed_attribute :notification_preferences, Types::Serializer::NotificationPreferences do |object, _params|
      camelize_hash(object.notification_preferences_by_kind)
    end

    typed_attribute :current_user, Types::Bool.meta(read_only: true) do
      true
    end

    typed_attribute :class_abilities, Types::Hash.meta(
      read_only: true,
      description: "A wide variety of all the permissions that you as a user have " \
      "for every kind of resource on the site. For each resource is a hash of keys " \
      "such as 'create', 'read', 'update', 'delete', and each key has a boolean value" \
      "attached to it"
    ) do |object|
      out = models_with_authorization.each_with_object({}) do |klass, abilities|
        abilities[klass.name.underscore] = klass.serialized_abilities_for(object)
      end
      camelize_hash(out)
    end

    typed_has_many :favorites

    typed_has_one :collection, serializer: V1::UserCollectionSerializer do |object, _params|
      object.composed_collection
    end

    class << self

      private

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

  end
end
