# Includes JSON API related functionality
module JSONAPI
  extend ActiveSupport::Concern

  included do
    after_action :set_content_type

    def render_jsonapi(*args)
      options = args.extract_options!
      to_serialize = args.first
      klass = determine_serializer_class(to_serialize, options)
      return render_json_error_response(to_serialize, options) if error_serializer?(klass)

      render_serialized_response(klass, to_serialize, options)
    end
  end

  private

  def error_serializer?(serializer_class)
    serializer_class == ::V1::ErrorSerializer
  end

  def render_json_error_response(to_serialize, options)
    s_options = build_serializer_options(options, to_serialize).except(:include)
    s_instance = ::V1::ErrorSerializer.new(serializable_errors(to_serialize), s_options)
    render_json_response(s_instance, options)
  end

  def render_serialized_response(klass, to_serialize, options)
    s_options = build_serializer_options(options, to_serialize)
    s_instance = klass.new(to_serialize, s_options)
    render_json_response(s_instance, options)
  end

  def render_json_response(s_instance, options)
    render jsonapi: s_instance, status: build_status(options)
  end

  def raise_not_errors
    raise "Objects passed to the error serializer must respond to errors."
  end

  def determine_serializer_class(to_serialize, options)
    key = options[:serializer] || serializer_key_for(to_serialize)
    serializer_class_for(key)
  end

  def serializable_errors(to_serialize)
    raise_not_errors unless to_serialize.respond_to?(:errors)
    V1::Helpers::Errors.new(to_serialize.errors).for_serialization

    # errors.map { |attribute, message| ::V1::Helpers::Error.new(attribute, message) }
  end

  def set_content_type
    response.headers["Content-Type"] = "application/vnd.api+json"
  end

  def serializer_class_for(serializer_class)
    return serializer_class unless serializer_class.is_a? Symbol

    version = self.class.controller_path.split("/").second.upcase.to_s
    serializer_name = serializer_class.to_s.classify + "Serializer"
    (version + "::" + serializer_name).constantize
  end

  def serializer_key_for(collection)
    klass = collection.respond_to?(:klass) && collection.klass ? collection.klass : collection.class
    base = klass.respond_to?(:base_class) ? klass.base_class : klass
    base.name.to_sym
  end

  def build_links(_options, _collection)
    {}
  end

  def build_meta(options, collection)
    meta = options.key?(:meta) && options[:meta].respond_to?(:key?) ? options[:meta] : {}
    meta[:pagination] = collection.respond_to?(:current_page) && !skip_pagination ? pagination_dict(collection) : { skipped: true }
    camelize_hash(meta)
  end

  # rubocop:disable Metrics/AbcSize
  def build_params(options, _collection)
    params = (options[:params] || {})
    params[:action] = request.params[:action]
    params[:current_user] = current_user
    params[:authority_user] = authority_user
    params[:pagination] = request.params[:page]
    params[:full] = (options[:full] || false)
    params[:calculate_all_abilities] = (options[:calculate_all_abilities] || false)
    params[:filters] = request.params[:filter].presence || {}.with_indifferent_access
    params
  end
  # rubocop:enable Metrics/AbcSize

  def build_include(options, _collection)
    return [] unless options.key?(:include)

    options[:include].is_a?(Array) ? options[:include] : [options[:include]]
  end

  def build_serializer_options(options, collection)
    {
      params: build_params(options, collection),
      meta: build_meta(options, collection),
      links: build_links(options, collection),
      include: build_include(options, collection)
    }
  end

  def build_status(options)
    options[:status] || :ok
  end

  def camelize_hash(hash)
    hash.deep_transform_keys { |key| key.to_s.camelize(:lower) }.symbolize_keys!
  end
end
