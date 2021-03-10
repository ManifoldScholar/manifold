module Testing
  # rubocop:disable Metrics/ParameterLists, Lint/UnusedMethodArgument, Naming/MethodParameterName, Layout/LineLength
  # rubocop:disable Layout/FirstHashElementIndentation, Style/TrailingCommaInHashLiteral
  class ManifoldClient
    extend Dry::Initializer

    COLLECTABLE_HASH = Types::Hash.schema(
      collectable_type: Types::String,
      collectable_id: Types::String,
      position?: Types::Integer
    )

    option :user, model: "User", optional: true

    # @return [String]
    attr_reader :auth_token

    # @return [String]
    attr_reader :client

    delegate :get, :post, :put, :patch, :delete, to: :client

    def initialize(*)
      super

      @client = Class.new(HTTPClient)

      apply_user!
    end

    def me
      get("/api/v1/me")
    end

    def my_collection
      get("/api/v1/me/relationships/collection")
    end

    def my_collected(type)
      get("/api/v1/me/relationships/#{type}")
    end

    def reading_groups
      get("/api/v1/reading_groups")
    end

    def reading_group(id)
      get("/api/v1/reading_groups/#{id}")
    end

    def favorite(*collectables)
      collection_operation(*collectables, op: :update, collector: user)
    end

    def unfavorite(*collectables)
      collection_operation(*collectables, op: :remove, collector: user)
    end

    def reading_group_collect(*collectables, reading_group:)
      collection_operation(*collectables, op: :update, collector: reading_group)
    end

    def reading_group_uncollect(*collectables, reading_group:)
      collection_operation(*collectables, op: :remove, collector: reading_group)
    end

    def collection_operation_body(*collectables, collector:, op:, include_collector_id: !collector.is_a?(User), for_current_user: collector.is_a?(User), **options)
      operation = {
        op: op,
        ref: collector_to_ref(collector, include_collector_id: include_collector_id, for_current_user: for_current_user),
        data: collectables_to_data(collectables)
      }

      wrap_operations operation
    end

    def collection_operation(*collectables, **options)
      body = collection_operation_body(*collectables, **options)

      post("/api/v1/operations", body: body.to_json)
    end

    private

    def apply_user!
      return unless @user.present?

      @auth_token = AuthToken.encode user_id: user.id

      @client.headers({
        "Accepts" => "application/vnd.api+json",
        "Authorization" => "Basic #{@auth_token}",
        "Content-Type" => "application/vnd.api+json",
      })
    end

    def collectables_to_data(collectables)
      collectables.map do |collectable|
        case collectable
        when Collectable
          { collectable_type: to_jsonapi_type(collectable), collectable_id: collectable.id }
        when COLLECTABLE_HASH
          collectable
        else
          raise TypeError, "Don't know how to serialize #{collectable.inspect}"
        end
      end
    end

    def collector_to_ref(collector, include_collector_id: true, for_current_user: false)
      {
        type: to_jsonapi_type(collector),
        relationship: "collection"
      }.tap do |h|
        h[:id] = collector.id if include_collector_id
        h[:lid] = "me" if for_current_user
      end
    end

    def to_jsonapi_type(model)
      model.model_name.collection.camelize(:lower)
    end

    def wrap_operations(*operations)
      {
        "atomic:operations" => operations.flatten
      }.as_json
    end

    class << self
      def cli(**options)
        options[:user] ||= User.cli_user

        new(options)
      end
    end

    class HTTPClient
      include HTTParty

      base_uri "http://manifold.lvh"
    end
  end
  # rubocop:enable Layout/FirstHashElementIndentation, Style/TrailingCommaInHashLiteral
  # rubocop:enable Metrics/ParameterLists, Lint/UnusedMethodArgument, Naming/MethodParameterName, Layout/LineLength
end
