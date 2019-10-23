module ApiDocs
  module Definition
    module Resource
      class Project

        READ_ONLY = [
          :avatar_styles, :hero_styles, :cover_styles, :created_at, :updated_at, :recently_updated,
          :image_credits_formatted, :events_count, :resource_collections_count, :avatar_meta,
          :subtitle_formatted, :title_formatted, :title_plaintext, :resource_kinds, :abilities,
          :resource_tags, :image_credits_formatted, :event_count, :resource_collections_count,
          :resource_count, :event_types, :metadata_formatted, :metadata_properties, :slug
        ].freeze

        WRITE_ONLY = [
          :pending_slug, :avatar, :hero, :cover
        ].freeze

        ATTRIBUTES = {
          title: Type.string(nullable: false),
          subtitle: Type.string,
          publication_date: Type.date_time,
          created_at: Type.date_time,
          updated_at: Type.date_time,
          avatar: Type.upload,
          avatar_styles: Type.attachment_styles,
          hero: Type.upload,
          hero_styles: Type.attachment_styles,
          recently_updated: Type.boolean,
          updated: Type.boolean,
          pending_slug: Type.string(description: I18n.t("attributes.descriptions.pending_slug")),
          slug: Type.string,
          avatar_color: Type.string(enum: %w(primary secondary tertiary quaternary quinary sentary)),
          avatar_meta: Type.object(description: I18n.t("attributes.descriptions.avatar_meta")),
          draft: Type.boolean,
          abilities: Type.abilities,
          subtitle_formatted: Type.string,
          title_formatted: Type.string,
          title_plaintext: Type.string,
          standalone_mode: Type.string(enum: %w(disabled enabled enforced)),
          standalone_mode_press_bar_text: Type.string,
          standalone_mode_press_bar_url: Type.url,
          hashtag: Type.string,
          description: Type.string,
          featured: Type.boolean,
          purchase_call_to_action: Type.string,
          twitter_id: Type.string,
          instagram_id: Type.string,
          facebook_id: Type.string,
          cover: Type.upload,
          cover_styles: Type.attachment_styles,
          description_formatted: Type.string,
          resource_kinds: Type.array(items: Type.string, description: "TKTKTKT"), # TODO: description
          resource_tags: Type.array(items: Type.string, description: "TKTKTKT"), # TODO: description
          dark_mode: Type.boolean,
          image_credits: Type.string,
          image_credits_formatted: Type.string,
          tag_list: Type.array(items: Type.string, description: "TKTKTKT"), # TODO: description
          event_count: Type.integer,
          metadata: Type.object(parameters: {
                                  doi: Type.url,
                                  edition: Type.string,
                                  isbn: Type.string,
                                  publisher: Type.string,
                                  publisher_place: Type.string,
                                  restrictions: Type.string,
                                  rights: Type.string,
                                  rights_holder: Type.string,
                                  rights_territory: Type.string,
                                  version: Type.string
                                }),
          resource_collections_count: Type.integer,
          resources_count: Type.integer,
          event_types: Type.array(items: Type.string),
          metadata_properties: Type.array(items: Type.string),
          citations: Type.object(description: "Citations of the book in a veriety of formats (mla, chicago, apa, etc.)"),
          hide_activity: Type.boolean,
          metadata_formatted: Type.object(description: "TKTKTKTKTK Seems to be the exact same thing as metadata") # TODO: question
        }.freeze

        RELATIONSHIPS = {
          action_callouts: Type.collection(contains: "action_callouts"),
          content_blocks: Type.collection(contains: "content_blocks"),
          contributors: Type.collection(contains: "contributors"),
          creators: Type.collection(contains: "creators"),
          events: Type.collection(contains: "events"),
          published_texts: Type.collection(contains: "texts"),
          resource_collections: Type.collection(contains: "resource_collections"),
          resources: Type.collection(contains: "resources"),
          subjects: Type.collection(contains: "subjects"),
          text_categories: Type.collection(contains: "text_categories"),
          texts: Type.collection(contains: "texts"),
          twitter_queries: Type.collection(contains: "twitter_queries")
        }.freeze

        class << self

          include Resource

        end
      end
    end
  end
end
