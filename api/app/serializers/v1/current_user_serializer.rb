module V1
  class CurrentUserSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::IsUser

    set_type :user

    attributes :persistent_ui

    attributes :notification_preferences do |object, _params|
      camelize_hash(object.notification_preferences_by_kind)
    end

    attributes :current_user do
      true
    end

    attributes :class_abilities do |object|
      out = models_with_authorization.each_with_object({}) do |klass, abilities|
        abilities[klass.name.underscore] = klass.serialized_abilities_for(object)
      end
      camelize_hash(out)
    end

    has_many :favorites

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
