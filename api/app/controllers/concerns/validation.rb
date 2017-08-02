# Includes strong parameter configuration
module Validation
  extend ActiveSupport::Concern

  def user_params
    params.require(:data)
    attributes = [:first_name, :last_name, :nickname, :name, :email, :password,
                  :password_confirmation, :remove_avatar, attachment(:avatar), :role]
    relationships = [:makers]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def project_params
    params.require(:data)
    attributes = [:title, :subtitle, :featured, :hashtag, :description, :purchase_url,
                  :purchase_price_money, :purchase_price_currency, :twitter_id,
                  :instagram_id, :remove_avatar, attachment(:avatar),
                  attachment(:hero), attachment(:cover), :remove_hero,
                  :remove_cover, :publication_date, metadata(Project), :avatar_color]
    relationships = [:collaborators, :creators, :contributors, :published_text]
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
    attributes = [:title, :description, attachment(:thumbnail)]
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
                  :iframe_dimensions, :embed_code, :subject]
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
    relationships = [:resource]
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
    attributes = [:title, :language, :position, :publication_date, metadata(Text),
                  :rights]
    relationships = [:category, :contributors, :creators]
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
          :contact_url
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
          :typekit_id
        ]
      },
      :remove_press_logo, attachment(:press_logo)
    ]
    param_config = structure_params(attributes: attributes)
    params.permit(param_config)
  end
  # rubocop:enable MethodLength

  def maker_params
    params.require(:data)
    attributes = [:first_name, :last_name, attachment(:avatar)]
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
    params.permit(filter: [:keyword, :typeahead])[:filter]
  end

  def event_filter_params
    params.permit(filter: [:keyword, :typeahead, :type])[:filter]
  end

  def annotation_filter_params
    # Client tends to pass indexes in the array of values, which makes rails reader it
    # as a hash. We're coercing the hash to an array here, before it hits strong params.
    if params.dig(:filter, :ids).respond_to? :values
      params[:filter][:ids] = params[:filter][:ids].values
    end
    params.permit(filter: [:text_section, :project, :text, ids: []])[:filter]
  end

  def subject_filter_params
    params.permit(filter: [:featured])[:filter]
  end

  def project_filter_params
    params.permit(filter: [:featured, :subject, :keyword, :typeahead])[:filter]
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
