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
          ],
          reading_groups: [:current_reading_group]
        }
      }
    }
    notification_preferences_by_kind = {
      notification_preferences_by_kind: [
        :digest,
        :replies_to_me,
        :project_comments_and_annotations,
        :flagged_resources,
        :digest_comments_and_annotations,
        :projects,
        :followed_projects
      ]
    }
    attributes = [:first_name, :last_name, :nickname, :name, :email, :password,
                  :password_confirmation, :remove_avatar, attachment(:avatar),
                  persistent_ui, notification_preferences_by_kind, :unsubscribe]
    attributes << :role if current_user&.admin?
    relationships = [:makers]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end
  # rubocop:enable Metrics/MethodLength

  def reading_group_membership_params
    params.require(:data)
    attributes = []
    relationships = [:reading_group, :user]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def reading_group_params
    params.require(:data)
    attributes = [:privacy, :name, :invitation_code, :notify_on_join]
    relationships = [:users]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def project_params
    params.require(:data)
    attributes = [:title, :subtitle, :featured, :hashtag, :description, :purchase_url,
                  :purchase_price_currency, :facebook_id, :purchase_call_to_action, :twitter_id,
                  :hide_activity, :instagram_id, :remove_avatar, attachment(:avatar),
                  attachment(:hero), :download_url, attachment(:cover), :remove_hero, :draft,
                  :remove_cover, :download_call_to_action, :publication_date, metadata(Project),
                  :avatar_color, :pending_slug, :tag_list, :dark_mode, :image_credits,
                  :standalone_mode, :standalone_mode_press_bar_text,
                  :standalone_mode_press_bar_url, :finished]
    relationships = [:collaborators, :creators, :contributors, :subjects]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def feature_params
    params.require(:data)
    attributes = [:header, :subheader, :body, :link_text, :link_url, :link_target, :style,
                  :hidden, :background_color, :foreground_color, :header_color, :layout,
                  :foreground_top, :foreground_left, attachment(:background),
                  :remove_background, attachment(:foreground), :remove_foreground,
                  :foreground_position, :position, :live, :include_sign_up]
    relationships = []
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def page_params
    params.require(:data)
    attributes = [:title, :pending_slug, :nav_title, :body, :show_in_footer, :show_in_header,
                  :hidden, :external_link, :is_external_link, :purpose, :open_in_new_tab]
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

  def resource_collection_params
    params.require(:data)
    attributes = [:title, :description, attachment(:thumbnail), :remove_thumbnail,
                  :pending_slug]
    relationships = [:project, :resources]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def project_collection_params
    params.require(:data)
    attributes = [:title, :sort_order, :visible, :homepage, :smart, :position, :icon,
                  :tag_list, :number_of_projects, :featured_only, :description,
                  :pending_slug, :homepage_start_date, :homepage_end_date,
                  :homepage_count]
    relationships = [:projects, :subjects]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def collection_project_params
    params.require(:data)
    attributes = [:position]
    relationships = []
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def action_callout_params
    params.require(:data)
    attributes = [:title, :kind, :location, :button, :position, :remove_attachment, :url,
                  attachment(:attachment)]
    relationships = [:project, :text]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  # rubocop:disable Metrics/MethodLength
  def resource_params
    params.require(:data)
    attributes = [attachment(:attachment), :remove_attachment,
                  attachment(:high_res), :remove_high_res,
                  attachment(:variant_format_one), :remove_variant_format_one,
                  attachment(:variant_format_two), :remove_variant_format_two,
                  attachment(:variant_thumbnail), :remove_variant_thumbnail,
                  attachment(:variant_poster), :remove_variant_poster,
                  :title, :caption, :description, :tag_list, :kind, :sub_kind,
                  :alt_text, :copyright_status, :copyright_holder, :credit,
                  :allow_download, :external_type, :external_url, :external_id,
                  :embed_code, :subject, :minimum_width, :maximum_width, :minimum_height,
                  :maximum_height, :iframe_allow_fullscreen, metadata(Resource),
                  :fingerprint, :pending_slug]
    relationships = [:project, :creators]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end
  # rubocop:enable Metrics/MethodLength

  def resource_metadata_params
    params.require(:data)
    param_config = structure_params(attributes: [metadata(Resource)], relationships: [])
    params.permit(param_config)
  end

  def resource_import_params
    params.require(:data)
    map_keys = (1..100).to_a.map(&:to_s)
    attributes = [attachment(:data), :source, :url, :storage_type,
                  :storage_identifier, :state, :header_row, column_map: map_keys]
    relationships = []
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  # rubocop:disable Metrics/MethodLength
  def ingestion_params
    params.require(:data)

    attributes = [
      :external_source_url,
      :ingestion_type,
      {
        source: [
          :id,
          :storage, { metadata: [:filename, :size, :mime_type] }
        ]
      }
    ]

    relationships = [:text]

    param_config = structure_params(
      attributes: attributes,
      relationships: relationships
    )

    params.permit(param_config)
  end
  # rubocop:enable Metrics/MethodLength

  def stylesheet_params
    params.require(:data)
    attributes = [:raw_styles, :name, :position]
    relationships = [:text_sections]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def annotation_params
    params.require(:data)
    attributes = [:start_node, :end_node, :start_char, :end_char, :section_id, :format,
                  :subject, :body, :private, :reading_group_id]
    relationships = [:resource, :resource_collection]
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
                  metadata(Text), :rights, :section_kind, :subtitle, :published,
                  :pending_slug]
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

  def content_block_params(type = nil)
    type ||= params.dig(:data, :attributes, :type)
    params.require(:data)
    attributes = [:position, :visible] << ContentBlock.permitted_attributes_for(type)
    relationships = ContentBlock.permitted_relationships_for(type)
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
          :default_publisher_place,
          :head_description,
          :social_share_message,
          :contact_email,
          :copyright,
          :press_site,
          :terms_url,
          :head_title,
          :twitter,
          :facebook
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
          :typekit_id,
          :header_offset,
          :top_bar_text,
          :top_bar_url,
          :top_bar_color,
          :top_bar_mode
        ]
      },
      :remove_press_logo, attachment(:press_logo),
      :remove_press_logo_footer, attachment(:press_logo_footer),
      :remove_press_logo_mobile, attachment(:press_logo_mobile),
      :remove_favicon, attachment(:favicon),
      google_service: [:data]
    ]
    param_config = structure_params(attributes: attributes)
    params.permit(param_config)
  end
  # rubocop:enable MethodLength

  def maker_params
    params.require(:data)
    attributes = [:first_name, :last_name, :middle_name, :suffix, attachment(:avatar),
                  :remove_avatar, :name, :prefix]
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

  def contact_params
    params.require(:data)
    attributes = [:email, :full_name, :message]
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

  def reading_group_membership_filter_params
    params.permit(filter: [:order])[:filter]
  end

  def resource_collection_filter_params
    params.permit(filter: [:keyword, :order])[:filter]
  end

  def resource_filter_params
    params.permit(filter: [:keyword, :kind, :tag, :order, :collection_order,
                           :project, :resource_collection])[:filter]
  end

  def comment_filter_params
    params.permit(filter: [])[:filter]
  end

  def version_filter_params
    params.permit(filter: [])[:filter]
  end

  def page_filter_params
    params.permit(filter: [:purpose])[:filter]
  end

  def project_collection_filter_params
    params.permit(filter: [:visible, :show_on_homepage, :projects, :order,
                           :visible_on_homepage])[:filter]
  end

  def user_filter_params
    params.permit(filter: [:keyword, :typeahead, :role, :order])[:filter]
  end

  def event_filter_params
    params.permit(filter: [:keyword, :typeahead, :type])[:filter]
  end

  def tag_filter_params
    params.permit(filter: [:keyword, :typeahead, :tag_scope])[:filter]
  end

  def search_params
    params[:facets] = params[:facets].values if params.dig(:facets).respond_to? :values
    params.permit(
      :keyword,
      :project,
      :text,
      :text_section,
      :raw,
      :all_facets,
      :search_num,
      :scope,
      facets: [],
      page: [:number]
    )
  end

  def annotation_filter_params
    coerce_filter_to_hash(:filter, :ids)
    coerce_filter_to_hash(:filter, :formats)
    params.permit(filter: [:orphaned,
                           :text, :text_section, :reading_group_membership,
                           { ids: [] },
                           [{ formats: [] }]])[:filter]
  end

  def subject_filter_params
    params.permit(filter: [:featured, :keyword, :typeahead, :used])[:filter]
  end

  def project_filter_params
    params.permit(
      filter: [:draft, :featured, :subject, :keyword, :order, :typeahead,
               :with_update_ability, :collection_order, :with_creator_role,
               :standalone_mode_enforced]
    )[:filter]
  end

  def feature_filter_params
    params.permit(
      filter: [:home]
    )[:filter]
  end

  def maker_filter_params
    params.permit(filter: [:keyword, :typeahead, :order])[:filter]
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
      relationships_config = relationships.each_with_object({}) do |relationship, config|
        config[relationship] = { data: [:type, :id] }
      end
      data << { relationships: relationships_config }
    end
    {
      data: data
    }
  end
end
