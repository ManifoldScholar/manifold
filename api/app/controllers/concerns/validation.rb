# Includes strong parameter configuration
module Validation
  extend ActiveSupport::Concern

  # rubocop:disable Metrics/MethodLength
  def user_params
    params.require(:data)
    persistent_ui = {
      persistent_ui: {
        reader: {
          colors: [:color_scheme],
          typography: [
            :font,
            { font_size: [:current, :max, :min] },
            { margins: [:current, :max, :min] }
          ]
        }
      }
    }
    attributes = [:first_name, :last_name, :nickname, :name, :email, :password,
                  :password_confirmation, :remove_avatar, attachment(:avatar), :role,
                  persistent_ui]
    relationships = [:makers]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end
  # rubocop:enable Metrics/MethodLength

  def project_params
    params.require(:data)
    attributes = [:title, :subtitle, :featured, :hashtag, :description, :purchase_url,
                  :purchase_price_money, :purchase_price_currency,
                  :purchase_call_to_action, :twitter_id, :hide_activity, :instagram_id,
                  :remove_avatar, attachment(:avatar), attachment(:hero),
                  attachment(:cover), :remove_hero, :draft, :remove_cover,
                  :publication_date, metadata(Project), :avatar_color]
    relationships = [:collaborators, :creators, :contributors, :published_text, :subjects]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def feature_params
    params.require(:data)
    attributes = [:header, :subheader, :body, :link_text, :link_url, :link_target, :style,
                  :hidden, :background_color, :foreground_color, :header_color, :layout,
                  :foreground_top, :foreground_left, attachment(:background),
                  :remove_background, attachment(:foreground), :remove_foreground,
                  :foreground_position, :position]
    relationships = []
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def page_params
    params.require(:data)
    attributes = [:title, :slug, :nav_title, :body, :show_in_footer, :show_in_header,
                  :hidden]
    relationships = []
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def twitter_query_params
    params.require(:data)
    attributes = [:query, :active, :result_type]
    relationships = []
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def collaborator_params
    params.require(:data)
    attributes = [:role]
    relationships = [:maker, :collaboratable]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def collection_params
    params.require(:data)
    attributes = [:title, :description, attachment(:thumbnail), :remove_thumbnail]
    relationships = [:project, :resources]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def resource_params
    params.require(:data)
    attributes = [attachment(:attachment), :remove_attachment,
                  attachment(:high_res), :remove_high_res,
                  attachment(:variant_format_one), :remove_variant_format_one,
                  attachment(:variant_format_two), :remove_variant_format_two,
                  attachment(:variant_thumbnail), :remove_variant_thumbnail,
                  attachment(:variant_poster), :remove_variant_poster,
                  :title, :caption, :description, :tag_list, :kind, :sub_kind,
                  :alt_text, :copyright_status, :copyright_holder, :credit, :keywords,
                  :allow_download, :external_type, :external_url, :external_id,
                  :embed_code, :subject, :minimum_width, :maximum_width, :minimum_height,
                  :maximum_height, :iframe_allow_fullscreen, metadata(Resource)]
    relationships = [:project, :creators]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def ingestion_params
    params.require(:data)
    attributes = [attachment(:source), :external_source_url, :ingestion_type]
    relationships = [:text]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def stylesheet_params
    params.require(:data)
    attributes = [:raw_styles, :name, :position]
    relationships = []
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def annotation_params
    params.require(:data)
    attributes = [:start_node, :end_node, :start_char, :end_char, :section_id, :format,
                  :subject, :body, :private]
    relationships = [:resource, :collection]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def category_params
    params.require(:data)
    attributes = [:title, :role, :position]
    relationships = [:project]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def favorite_params
    params.require(:data).require(:relationships).require(:favoritable).require(:data)
    attributes = []
    relationships = [:favoritable]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def comment_params(comment = nil)
    params.require(:data)
    attributes = [:body, :parent_id, :deleted]
    attributes.push :deleted if comment && current_user.can_delete?(comment)
    relationships = []
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def text_params
    params.require(:data)
    attributes = [:title, :language, :position, :description, :publication_date,
                  metadata(Text), :rights, :section_kind]
    relationships = [:category, :contributors, :creators]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def subject_params
    params.require(:data)
    attributes = [:name]
    relationships = []
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  # rubocop:disable MethodLength
  def settings_params
    params.require(:data)
    attributes = [
      {
        general: [
          :installation_name,
          :default_publisher,
          :default_place_of_publication,
          :social_share_message,
          :contact_url,
          :copyright
        ]
      },
      {
        secrets: [
          :facebook_app_secret,
          :twitter_app_secret,
          :twitter_access_token_secret,
          :google_private_key,
          :smtp_settings_password
        ]
      },
      {
        integrations: [
          :facebook_app_id,
          :twitter_app_id,
          :twitter_access_token,
          :google_project_id,
          :google_private_key_id,
          :google_client_email,
          :google_client_id,
          :ga_tracking_id,
          :ga_profile_id
        ]
      },
      {
        email: [
          :from_address,
          :from_name,
          :reply_to_address,
          :reply_to_name,
          :closing,
          :delivery_method,
          :smtp_settings_address,
          :smtp_settings_port,
          :smtp_settings_user_name,
          :sendmail_settings_location,
          :sendmail_settings_arguments
        ]
      },
      {
        theme: [
          :logo_styles,
          :typekit_id
        ]
      },
      :remove_press_logo, attachment(:press_logo),
      google_service: [:data]
    ]
    param_config = structure_params(attributes: attributes)
    params.permit(param_config)
  end
  # rubocop:enable MethodLength

  def maker_params
    params.require(:data)
    attributes = [:first_name, :last_name, :middle_name, :suffix, attachment(:avatar),
                  :remove_avatar, :name]
    relationships = [:users]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def password_params
    params.require(:data)
    attributes = [:password, :password_confirmation, :reset_token, :email]
    param_config = structure_params(attributes: attributes)
    params.permit(param_config)
  end

  def permission_params
    params.require(:data)
    attributes = [{ role_names: [] }]
    relationships = [:user]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def favoritable_params
    structure_params
  end

  def collection_filter_params
    params.permit(filter: [:keyword])[:filter]
  end

  def resource_filter_params
    params.permit(filter: [:keyword, :kind, :tag, :order, :collection_order,
                           :project, :collection])[:filter]
  end

  def comment_filter_params
    params.permit(filter: [])[:filter]
  end

  def user_filter_params
    params.permit(filter: [:keyword, :typeahead, :role])[:filter]
  end

  def event_filter_params
    params.permit(filter: [:keyword, :typeahead, :type])[:filter]
  end

  def reader_search_params
    params[:facets] = params[:facets].values if params.dig(:facets).respond_to? :values
    params.permit(
      :keyword,
      :project,
      :text,
      :text_section,
      :raw,
      facets: [],
      page: [:number]
    )
  end

  def annotation_filter_params
    coerce_filter_to_hash(:filter, :ids)
    coerce_filter_to_hash(:filter, :formats)
    params.permit(filter: [{ ids: [] }, [{ formats: [] }], :text, :text_section])[:filter]
  end

  def subject_filter_params
    params.permit(filter: [:featured, :keyword, :typeahead, :used])[:filter]
  end

  def project_filter_params
    params.permit(filter: [:featured, :subject, :keyword, :order, :typeahead])[:filter]
  end

  def maker_filter_params
    params.permit(filter: [:keyword, :typeahead])[:filter]
  end

  def attributes_from(valid_params)
    attr = valid_params["data"]["attributes"]
    attr[:id] = valid_params["data"]["id"] if
      valid_params["data"] && valid_params["data"]["id"]
    attr
  end

  private

  def metadata(klass)
    { metadata: klass.metadata_properties }
  end

  def attachment(name)
    { name => [:data, :filename, :content_type] }
  end

  def allowed_meta
    [
      :created_by_admin
    ]
  end

  # Client tends to pass indexes in the array of values, which makes rails reader it
  # as a hash. We're coercing the hash to an array here, before it hits strong params.
  def coerce_filter_to_hash(param, key)
    return unless params.dig(param, key).respond_to? :values
    params[param][key] = params[param][key].values
  end

  def structure_params(attributes: nil, relationships: nil)
    data = [:type, :id]
    data << { meta: allowed_meta }
    data << { attributes: attributes } unless attributes.nil?
    unless relationships.nil?
      relationships_config = {}
      relationships.each do |relationship|
        relationships_config[relationship] = { data: [:type, :id] }
      end
      data << { relationships: relationships_config }
    end
    {
      data: data
    }
  end
end
