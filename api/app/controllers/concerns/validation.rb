# frozen_string_literal: true

# Includes strong parameter configuration
module Validation
  extend ActiveSupport::Concern

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
          reading_groups: [:current_annotating_reading_group, :current_annotation_overlay_reading_group]
        },
        locale: [:language]
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
                  persistent_ui, notification_preferences_by_kind, :unsubscribe,
                  :consent_manifold_analytics, :consent_google_analytics,
                  :terms_and_conditions_accepted_at]
    attributes += %i[admin_verified role] if current_user&.admin?
    relationships = [:makers]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def reading_group_membership_params
    params.require(:data)
    attributes = []
    relationships = []

    reading_group = @reading_group || @reading_group_membership&.reading_group

    if reading_group.present? && current_user&.can_update?(reading_group)
      attributes << :annotation_style
      attributes << :role
      attributes << :label
      relationships << :reading_group
      relationships << :user
    end

    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def reading_group_params
    params.require(:data)
    attributes = [:privacy, :name, :invitation_code, :notify_on_join, { course: [:enabled, :starts_on, :ends_on] }]
    relationships = [:kind, :users]
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
                  :avatar_color, { tag_list: [] }, :dark_mode, :image_credits,
                  :standalone_mode, :standalone_mode_press_bar_text, :restricted_access,
                  :standalone_mode_press_bar_url, :finished, :restricted_access_heading,
                  :restricted_access_body, :open_access, :disable_engagement,
                  :journal_issue_pending_sort_title, :journal_issue_number, :pending_slug]
    relationships = [:collaborators, :creators, :contributors, :subjects, :journal_volume]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def journal_params
    params.require(:data)
    attributes = [:title, :subtitle, :hashtag, :description, :facebook_id, :twitter_id,
                  :instagram_id, :remove_avatar, attachment(:avatar),
                  attachment(:hero), attachment(:logo), :remove_hero, :draft,
                  :remove_logo, metadata(Journal), :avatar_color, :pending_slug,
                  { tag_list: [] }, :image_credits, :social_description,
                  attachment(:custom_icon), :hero_layout, :remove_custom_icon,
                  :social_title, attachment(:social_image), :remove_social_image,
                  :hero_background_color, :show_on_homepage, :home_page_priority]

    relationships = [:collaborators, :creators, :contributors, :subjects]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def journal_volume_params
    params.require(:data)
    attributes = [:number, :pending_slug]
    relationships = [:journal]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def journal_issue_params
    params.require(:data)
    attributes = [:number]
    relationships = [:journal, :project, :journal_volume]
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
                  { tag_list: [] }, :number_of_projects, :featured_only, :description, :short_description,
                  :pending_slug, :homepage_start_date, :homepage_end_date,
                  :homepage_count, :social_description, attachment(:custom_icon),
                  attachment(:hero), :hero_layout, :remove_hero, :remove_custom_icon,
                  :social_title, attachment(:social_image), :remove_social_image]
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
                  :visibility, attachment(:attachment)]
    relationships = [:calloutable, :text]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def entitlement_params
    params.require(:data)

    attributes = [
      :subject_url,
      :target_url,
      :expiration,
      { global_roles: %i[subscriber],
        scoped_roles: %i[read_access] }
    ]

    param_config = structure_params(attributes: attributes)

    params.permit(param_config)
  end

  def pending_entitlement_filter_params
    params[:filter] ||= {}

    params[:filter][:state] = :pending unless params[:filter][:state]
    params[:filter][:order] = :default unless params[:filter][:order]

    params.permit(filter: [:email, :order, :state])[:filter]
  end

  def pending_entitlement_params
    params.require(:data)

    attributes = [
      :email,
      :first_name,
      :last_name,
      :subject_url,
      :expiration,
    ]

    param_config = structure_params(attributes: attributes)

    params.permit(param_config)
  end

  def entitlement_import_params
    params.require(:data)

    attributes = [
      :name, attachment(:file),
    ]

    param_config = structure_params(attributes: attributes)

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
                  :title, :caption, :description, { tag_list: [] }, :kind, :sub_kind,
                  :alt_text, :copyright_status, :credit,
                  :allow_download, :external_type, :external_url, :external_id,
                  :embed_code, :minimum_width, :minimum_height, { iframe_allows: [] },
                  metadata(Resource),
                  :fingerprint, :pending_slug, :pending_sort_title]
    relationships = [:project, :creators]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def resource_metadata_params
    params.require(:data)
    param_config = structure_params(attributes: [metadata(Resource)], relationships: [])
    params.permit(param_config)
  end

  def resource_import_params
    params.require(:data)
    map_keys = (1..100).to_a.map(&:to_s)
    attributes = [attachment(:data), :source, :url, :storage_type,
                  :storage_identifier, :state, :header_row, { column_map: map_keys }]
    relationships = []
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

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

    relationships = [:text, :text_section]

    param_config = structure_params(
      attributes: attributes,
      relationships: relationships
    )

    params.permit(param_config)
  end

  def ingestion_source_params
    params.require(:data)

    attributes = [:display_name, attachment(:attachment), :kind, :source_identifier]
    param_config = structure_params(attributes: attributes)

    params.permit(param_config)
  end

  def ingestion_source_filter_params
    params[:filter] = params[:filter].except(:kind) if !params[:filter].nil? && params[:filter][:kind] == ""
    params.permit(filter: [:order, :keyword, :kind])[:filter]
  end

  def stylesheet_params
    params.require(:data)
    attributes = [:raw_styles, :name, :position, :applies_to_all_text_sections]
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
    toc_attrs = %i[id type label anchor uid]
    nested_toc = 10.times.reduce(toc_attrs) { |nested, _| [*toc_attrs, { children: nested }] }

    params.require(:data)
    attributes = [:title, :position, :description, :publication_date,
                  metadata(Text), :section_kind, :subtitle, :published,
                  :pending_slug, attachment(:cover), :remove_cover,
                  :ignore_access_restrictions, :start_text_section_id, { toc: nested_toc }, { section_names: [] }]
    relationships = [:category, :contributors, :creators]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def text_section_params
    params.require(:data)
    attributes = [:name, :body, :position, :kind, :slug, :hidden_in_reader]
    param_config = structure_params(attributes: attributes)
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
    attributes = [:position, :visible, :access] << ContentBlock.permitted_attributes_for(type)
    relationships = ContentBlock.permitted_relationships_for(type)
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  # @see SettingSections
  # @api private
  BASE_SETTING_ATTRIBUTES = {
    **SettingSections[:strong_params],
    google_service: %i[data],
  }.freeze

  def settings_params
    params.require(:data)

    attributes = [
      BASE_SETTING_ATTRIBUTES,
      :remove_press_logo, attachment(:press_logo),
      :remove_press_logo_footer, attachment(:press_logo_footer),
      :remove_press_logo_mobile, attachment(:press_logo_mobile),
      :remove_favicon, attachment(:favicon),
    ]

    param_config = structure_params(attributes: attributes)

    params.permit(param_config)
  end

  def export_target_params
    params.require(:data)

    attributes = [
      :name, :strategy,
      {
        configuration: [
          :target_name_format,
          {
            sftp_key: %i[host port username private_key],
            sftp_password: %i[host port username password]
          }
        ]
      }
    ]

    relationships = []

    param_config = structure_params(attributes: attributes, relationships: relationships)

    params.permit(param_config)
  end

  def project_exportation_params
    params.require(:data)

    attributes = [
      :project_id, :export_target_id
    ]

    relationships = [:project, :export_target]

    param_config = structure_params(attributes: attributes, relationships: relationships)

    params.permit(param_config)
  end

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

  def analytics_filter_params
    params.permit(:record_type, :record_id, :start_date, :end_date, :report_type, analytics: [], page: [:number, :size])
  end

  def analytics_params
    params.require(:data)
    attributes = [:record_type, :record_id, :name, :time, :visit_token, :visitor_token, { properties: [] }]
    param_config = structure_params(attributes: attributes)
    params.permit(param_config)
  end

  def favoritable_params
    structure_params
  end

  def reading_group_filter_params
    params.permit(filter: [:keyword, :sort_order, :archived])[:filter] || {}
  end

  def reading_group_membership_filter_params
    params.permit(filter: [:order])[:filter]
  end

  def resource_collection_filter_params
    params.permit(filter: [:keyword, :order])[:filter]
  end

  def resource_filter_params
    params.with_defaults(
      filter: { order: "sort_title ASC" }
    ).permit(filter: [:keyword,
                      :kind,
                      :tag,
                      :order,
                      :collection_order,
                      :project,
                      :resource_collection])[:filter]
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

  def empty_filter_params
    {}
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
      page: [:number, :size]
    )
  end

  def annotation_filter_params
    coerce_filter_to_hash(:filter, :ids)
    coerce_filter_to_hash(:filter, :formats)
    params.permit(
      filter: [
        :orphaned, :text, :text_section, :reading_group_membership, :order,
        { ids: [] },
        [{ formats: [] }]
      ]
    )[:filter] || {}
  end

  def subject_filter_params
    params.permit(filter: [:featured, :keyword, :typeahead, :used])[:filter]
  end

  def entitlement_filter_params
    params.permit(filter: [:keyword])[:filter] || {}
  end

  def project_filter_params
    params.permit(
      filter: [:draft, :featured, :subject, :keyword, :order, :typeahead,
               :with_update_ability, :collection_order, :with_creator_role,
               :standalone_mode_enforced, :no_issues]
    )[:filter]
  end

  def journal_issue_filter_params
    params.permit(
      filter: [:keyword, :order, :typeahead, :journal_id, :journal_volume_id,
               :volume_is_nil, :with_update_ability]
    )[:filter]
  end

  def journal_filter_params
    params.permit(
      filter: [:draft, :keyword, :order, :typeahead, :show_on_homepage, :with_update_ability, :with_update_or_issue_update_ability]
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
    { name => [:data, :filename, :content_type, :alt_text] }
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
        config[relationship] = { data: [:type, :id, :_remove] }
      end
      data << { relationships: relationships_config }
    end
    {
      data: data
    }
  end

  module ClassMethods
    # @param [Class, #model_name] klass
    # @return [Symbol, nil]
    def filter_param_method_for(klass)
      prefix = klass.model_name.singular

      :"#{prefix}_filter_params".yield_self do |filter_method|
        filter_method if method_defined? filter_method
      end
    end
  end
end
