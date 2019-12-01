module V1
  class ProjectSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::WithAbilities
    include ::V1::Concerns::WithMetadata

    make_partial_by_default

    with_metadata_if_full(metadata: true, properties: true, formatted: true)

    attributes :title,
               :subtitle,
               :subtitle_formatted,
               :subtitle_plaintext,
               :title_formatted,
               :title_plaintext,
               :publication_date,
               :created_at,
               :updated_at,
               :slug,
               :avatar_color,
               :avatar_meta,
               :draft,
               :finished,
               :creator_names

    attributes :abilities do |object, params|
      abilities(object, params)
    end

    attribute :recently_updated, &:recently_updated?
    attribute :recently_updated, &:recently_updated?
    attribute :updated, &:updated?
    camelized_attributes :avatar_styles

    has_many :creators,
             serializer: ::V1::MakerSerializer,
             record_type: :maker

    full_camelized_attributes :hero_styles, :cover_styles
    full_attributes :hashtag,
                    :description,
                    :featured,
                    :purchase_url,
                    :purchase_price_money,
                    :purchase_price_currency,
                    :purchase_price,
                    :purchase_call_to_action,
                    :twitter_id,
                    :instagram_id,
                    :facebook_id,
                    :description_formatted,
                    :resource_kinds,
                    :dark_mode,
                    :image_credits,
                    :image_credits_formatted,
                    :tag_list,
                    :event_count,
                    :resource_collections_count,
                    :resources_count,
                    :event_types,
                    :citations,
                    :hide_activity,
                    :standalone_mode,
                    :download_url,
                    :download_call_to_action,
                    :pending_slug,
                    :standalone_mode,
                    :standalone_mode_press_bar_text,
                    :standalone_mode_press_bar_url

    full_attributes :event_count, &:filtered_event_count
    full_attributes :event_types, &:uniq_event_types
    full_attributes :resource_tags, &:sorted_resource_tags

    full_has_many :texts,
                  object_method_name: :text_summaries,
                  id_method_name: :text_summary_ids,
                  serializer: ::V1::TextSerializer
    full_has_many :published_texts, record_type: :texts
    full_has_many :text_categories,
                  serializer: ::V1::CategorySerializer,
                  record_type: "category"
    full_has_many :events,
                  id_method_name: :events_for_project_detail_ids,
                  object_method_name: :events_for_project_detail
    full_has_many :resource_collections
    full_has_many :resources,
                  id_method_name: :resources_for_project_detail_ids,
                  object_method_name: :resources_for_project_detail
    full_has_many :subjects
    full_has_many :twitter_queries
    full_has_many :permitted_users, serializer: ::V1::UserSerializer
    full_has_many :content_blocks, polymorphic: true
    full_has_many :action_callouts
    full_has_many :contributors,
                  serializer: ::V1::MakerSerializer,
                  record_type: :maker

    class << self

      def filtered_events(project)
        project.events.excluding_type(%w(comment_created text_annotated))
      end

    end

  end
end
