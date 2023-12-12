module V1
  module Concerns
    module ProjectSerializer
      extend ActiveSupport::Concern

      included do
        abilities

        typed_attribute :title, Types::String
        typed_attribute :subtitle, Types::String.optional
        typed_attribute :subtitle_formatted, Types::String.meta(read_only: true)
        typed_attribute :subtitle_plaintext, Types::String.meta(read_only: true)
        typed_attribute :title_formatted, Types::String.meta(read_only: true)
        typed_attribute :title_plaintext, Types::String.meta(read_only: true)
        typed_attribute :publication_date, Types::DateTime.optional
        typed_attribute :created_at, Types::DateTime.meta(read_only: true)
        typed_attribute :updated_at, Types::DateTime.meta(read_only: true)
        typed_attribute :slug, Types::String.meta(read_only: true)
        typed_attribute :avatar_color, Types::String.enum("primary", "secondary", "tertiary", "quaternary", "quinary", "sentary")
        typed_attribute :avatar_meta, Types::Hash.meta(read_only: true)
        typed_attribute :draft, Types::Bool
        typed_attribute :finished, Types::Bool
        typed_attribute :creator_names, Types::String.meta(read_only: true)
        typed_attribute :recently_updated, Types::Bool.meta(read_only: true), &:recently_updated?
        typed_attribute :updated, Types::Bool.meta(read_only: true), &:updated?
        typed_attribute :avatar_styles, Types::Serializer::Attachment.meta(read_only: true)
        typed_attribute :avatar_alt_text, Types::String.optional
        typed_attribute :is_journal_issue, Types::Bool.meta(read_only: true), &:journal_issue?
        typed_has_many :creators, serializer: ::V1::MakerSerializer, record_type: :maker
        typed_attribute :entitlement_subject_url, Types::String.meta(read_only: true)

        serialize_collectable_attributes!

        when_full do
          metadata(metadata: true, properties: true, formatted: true)
          typed_attribute :hero_styles, Types::Serializer::Attachment.meta(read_only: true)
          typed_attribute :hero_alt_text, Types::String.optional
          typed_attribute :cover_styles, Types::Serializer::Attachment.meta(read_only: true)
          typed_attribute :cover_alt_text, Types::String.optional
          typed_attribute :hashtag, Types::String.optional
          typed_attribute :description, Types::String.optional
          typed_attribute :featured, Types::Bool
          typed_attribute :restricted_access, Types::Bool
          typed_attribute :open_access, Types::Bool
          typed_attribute :restricted_access_heading, Types::String.optional
          typed_attribute :restricted_access_body, Types::String.optional
          typed_attribute :restricted_access_body_formatted, Types::String.meta(read_only: true)
          typed_attribute :purchase_url, Types::Serializer::URL.optional
          typed_attribute :purchase_price_money, Types::String.meta(example: "$0.00").meta(read_only: true)
          typed_attribute :purchase_price_currency, Types::String.optional.meta(example: "USD")
          typed_attribute :purchase_price, Types::Float.optional.meta(read_only: true)
          typed_attribute :purchase_call_to_action, Types::String.optional
          typed_attribute :twitter_id, Types::String.optional
          typed_attribute :instagram_id, Types::String.optional
          typed_attribute :facebook_id, Types::String.optional
          typed_attribute :description_formatted, Types::String.meta(read_only: true)
          typed_attribute :resource_kinds, Types::Array.of(Types::String).meta(read_only: true)
          typed_attribute :dark_mode, Types::Bool
          typed_attribute :image_credits, Types::String.optional
          typed_attribute :image_credits_formatted, Types::String.meta(read_only: true)
          typed_attribute :tag_list, Types::Array.of(Types::String)
          typed_attribute :resource_collections_count, Types::Integer.meta(read_only: true)
          typed_attribute :resources_count, Types::Integer.meta(read_only: true)
          typed_attribute :citations, Types::Serializer::Citations
          typed_attribute :hide_activity, Types::Bool
          typed_attribute :standalone_mode, Types::String.enum("disabled", "enabled", "enforced")
          typed_attribute :download_url, Types::String.optional
          typed_attribute :download_call_to_action, Types::String.optional
          typed_attribute :pending_slug, Types::String
          typed_attribute :standalone_mode_press_bar_text, Types::String.optional
          typed_attribute :standalone_mode_press_bar_url, Types::String.optional
          typed_attribute :event_count, Types::Integer.meta(read_only: true), &:filtered_event_count
          typed_attribute :event_types, Types::Array.of(Types::String).meta(read_only: true), &:uniq_event_types
          typed_attribute :resource_tags, Types::Array.of(Types::String).meta(read_only: true), &:sorted_resource_tags
          typed_attribute :disable_engagement, Types::Bool
          typed_attribute :journal_issue_number, Types::String.optional
          typed_attribute :journal_issue_pending_sort_title, Types::String.optional
          typed_attribute :journal_volume_number, Types::String.optional

          typed_has_one :journal
          typed_has_one :journal_volume, record_type: "journalVolume"
          typed_has_one :journal_issue, record_type: "journalIssue"

          typed_has_many :texts,
                         object_method_name: :text_summaries,
                         id_method_name: :text_summary_ids,
                         serializer: ::V1::TextSerializer
          typed_has_many :published_texts, record_type: :text
          typed_has_many :text_categories,
                         serializer: ::V1::CategorySerializer,
                         record_type: :category
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

          typed_attribute :texts_nav, Types::Array.of(
            Types::Hash.schema(
              id: Types::Serializer::ID,
              label: Types::String
            )
          ).meta(read_only: true).optional
          typed_attribute :journal_nav, Types::Hash.schema(
            id: Types::Serializer::ID,
            label: Types::String
          ).meta(read_only: true).optional
          typed_attribute :journal_issues_nav, Types::Array.of(
            Types::Hash.schema(
              id: Types::Serializer::ID,
              label: Types::String
            )
          ).meta(read_only: true).optional do |object, params|
            journal = object.journal
            journal.issues_nav(user: params[:current_user]) if journal.present?
          end
        end
      end

      class_methods do
        def filtered_events(project)
          project.events.excluding_type(%w(comment_created text_annotated))
        end
      end
    end
  end
end
