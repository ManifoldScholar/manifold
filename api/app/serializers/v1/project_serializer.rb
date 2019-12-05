module V1
  class ProjectSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :title, String
    typed_attribute :subtitle, String
    typed_attribute :subtitle_formatted, String
    typed_attribute :subtitle_plaintext, String
    typed_attribute :title_formatted, String
    typed_attribute :title_plaintext, String
    typed_attribute :publication_date, DateTime
    typed_attribute :created_at, DateTime
    typed_attribute :updated_at, DateTime
    typed_attribute :slug, String
    typed_attribute :avatar_color, String
    typed_attribute :avatar_meta, Hash
    typed_attribute :draft, String
    typed_attribute :finished, String
    typed_attribute :creator_names, String
    typed_attribute :recently_updated, String, &:recently_updated?
    typed_attribute :updated, String, &:updated?
    typed_attribute :avatar_styles, Hash

    typed_has_many :creators, serializer: ::V1::MakerSerializer, record_type: :maker

    # rubocop:disable Metrics/BlockLength
    when_full do
      metadata(metadata: true, properties: true, formatted: true)
      typed_attribute :hero_styles, Hash
      typed_attribute :cover_styles, Hash
      typed_attribute :hashtag, String
      typed_attribute :description, String
      typed_attribute :featured, NilClass
      typed_attribute :purchase_url, String
      typed_attribute :purchase_price_money, Float
      typed_attribute :purchase_price_currency, String
      typed_attribute :purchase_price, Float
      typed_attribute :purchase_call_to_action, String
      typed_attribute :twitter_id, String
      typed_attribute :instagram_id, String
      typed_attribute :facebook_id, String
      typed_attribute :description_formatted, String
      typed_attribute :resource_kinds, String
      typed_attribute :dark_mode, String
      typed_attribute :image_credits, String
      typed_attribute :image_credits_formatted, String
      typed_attribute :tag_list, String
      typed_attribute :resource_collections_count, Integer
      typed_attribute :resources_count, Integer
      typed_attribute :citations, Hash
      typed_attribute :hide_activity, String
      typed_attribute :standalone_mode, String
      typed_attribute :download_url, String
      typed_attribute :download_call_to_action, String
      typed_attribute :pending_slug, String
      typed_attribute :standalone_mode, String
      typed_attribute :standalone_mode_press_bar_text, String
      typed_attribute :standalone_mode_press_bar_url, String
      typed_attribute :event_count, Integer, &:filtered_event_count
      typed_attribute :event_types, Array, &:uniq_event_types
      typed_attribute :resource_tags, Array, &:sorted_resource_tags
      typed_attribute :hero_styles, Hash
      typed_attribute :cover_styles, Hash

      typed_has_many :texts,
                     object_method_name: :text_summaries,
                     id_method_name: :text_summary_ids,
                     serializer: ::V1::TextSerializer
      typed_has_many :published_texts, record_type: :text
      typed_has_many :text_categories,
                     serializer: ::V1::CategorySerializer,
                     record_type: "category"
      typed_has_many :events,
                     id_method_name: :events_for_project_detail_ids,
                     object_method_name: :events_for_project_detail
      typed_has_many :resource_collections
      typed_has_many :resources,
                     id_method_name: :resources_for_project_detail_ids,
                     object_method_name: :resources_for_project_detail
      typed_has_many :subjects
      typed_has_many :twitter_queries
      typed_has_many :permitted_users, serializer: ::V1::UserSerializer
      typed_has_many :content_blocks, polymorphic: true
      typed_has_many :action_callouts
      typed_has_many :contributors,
                     serializer: ::V1::MakerSerializer,
                     record_type: :maker
    end
    # rubocop:enable Metrics/BlockLength

    class << self

      def filtered_events(project)
        project.events.excluding_type(%w(comment_created text_annotated))
      end

    end

  end
end
