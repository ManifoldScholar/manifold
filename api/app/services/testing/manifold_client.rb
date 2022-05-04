module Testing
  # rubocop:disable Metrics/ParameterLists, Lint/UnusedMethodArgument, Naming/MethodParameterName, Layout/LineLength
  # rubocop:disable Layout/FirstHashElementIndentation
  class ManifoldClient
    extend Dry::Initializer

    COLLECTABLE_HASH = Types::Hash.schema(
      collectable_type: Types::String,
      collectable_id: Types::String,
      position?: Types::Integer,
      grouping_id?: Types::String
    )

    ORDERING_HASH = Types::Hash.schema(
      collectable: Types.Instance(Collectable),
      position: Types::Integer,
      grouping_id?: Types::String
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

    def my_annotations
      get("/api/v1/me/relationships/annotations")
    end

    def my_annotated_texts
      get("/api/v1/me/relationships/annotated_texts")
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

    def reading_group_annotations_by_membership(rg, rgm, filter: {}, **query)
      filter[:reading_group_membership] = rgm.to_param

      options = { **query, filter: filter }

      get_with_query "/api/v1/reading_groups/#{rg.to_param}/relationships/annotations", **options
    end

    def favorite(*collectables)
      collection_operation(*collectables, op: :update, collector: user)
    end

    def unfavorite(*collectables)
      collection_operation(*collectables, op: :remove, collector: user)
    end

    def reading_group_clone(reading_group, **options)
      body = { data: { attributes: options } }.deep_transform_keys do |k|
        k.to_s.camelize(:lower)
      end

      post("/api/v1/reading_groups/#{reading_group.id}/clone", body: body.to_json)
    end

    def reading_group_join(reading_group, **options)
      post("/api/v1/reading_groups/#{reading_group.id}/join")
    end

    def reading_group_collect(*collectables, reading_group:)
      collection_operation(*collectables, op: :update, collector: reading_group)
    end

    def reading_group_collect_reorder(collectable, position, reading_group:, grouping_id: nil)
      hsh = collectable_to_hash(collectable, position: position, grouping_id: grouping_id)

      reading_group_collect hsh, reading_group: reading_group
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

    def get_with_query(uri, filter: {}, **keys)
      query = keys.merge(filter: filter.presence).compact

      query_string = query.to_param

      get "#{uri}?#{query_string}"
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
          collectable_to_hash(collectable)
        when COLLECTABLE_HASH
          collectable
        when ORDERING_HASH
          hsh = collectable.symbolize_keys

          collectable = hsh[:collectable]

          collectable_to_hash(collectable, position: hsh[:position], grouping_id: hsh[:grouping_id])
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

    def collectable_to_hash(collectable, position: nil, grouping_id: nil)
      { collectable_type: to_jsonapi_type(collectable), collectable_id: collectable.id }.tap do |h|
        h[:position] = position if position.present?
        h[:grouping_id] = grouping_id if grouping_id.present?
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

    module ResponseWrapping
      def get(...)
        wrap_response super
      end

      def post(...)
        wrap_response super
      end

      def put(...)
        wrap_response super
      end

      def delete(...)
        wrap_response super
      end

      def wrap_response(response)
        return response unless response.is_a?(HTTParty::Response) && response.ok? && response.parsed_response.is_a?(Hash)

        response.parsed_response.with_indifferent_access
      end
    end

    prepend ResponseWrapping
  end
  # rubocop:enable Layout/FirstHashElementIndentation
  # rubocop:enable Metrics/ParameterLists, Lint/UnusedMethodArgument, Naming/MethodParameterName, Layout/LineLength
end
