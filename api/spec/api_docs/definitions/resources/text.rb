module ApiDocs
  module Definition
    module Resource
      class Text

        metadata = {
          series_title: Type.string,
          container_title: Type.string,
          isbn: Type.string,
          issn: Type.string,
          doi: Type.string,
          unique_identifier: Type.string,
          language: Type.string,
          original_publisher: Type.string,
          original_publisher_place: Type.string,
          original_title: Type.string,
          publisher: Type.string,
          publisher_place: Type.string,
          version: Type.string,
          series_number: Type.string,
          edition: Type.string,
          issue: Type.string,
          volume: Type.string,
          rights: Type.string,
          rights_territory: Type.string,
          restrictions: Type.string,
          rights_holder: Type.string,
          original_publication_date: Type.date_time
        }

        READ_ONLY = [
          :creator_names,
          :created_at,
          :updated_at,
          :start_text_section_id,
          :annotations_count,
          :highlights_count,
          :bookmarks_count,
          :metadata_properties,
          :age,
          :cover_styles,
          :slug,
          :title_formatted,
          :title_plaintext,
          :subtitle_formatted,
          :subtitle_plaintext,
          :description_formatted,
          :metadata_formatted,
          :citations,
          :spine,
          :abilities,
          :ingestion_source_download_url,
          :ingestion_external_source_url,
          :sections_map,
          :toc,
        ].freeze

        WRITE_ONLY = [].freeze

        ATTRIBUTES = {
          title: Type.string,
          creator_names: Type.string,
          created_at: Type.date_time,
          updated_at: Type.date_time,
          start_text_section_id: Type.id(description: "The ID of the starting text section"),
          published: Type.boolean,
          annotations_count: Type.integer,
          highlights_count: Type.integer,
          age: Type.integer(description: "The age of the resource in days"),
          position: Type.integer,
          publication_date: Type.date,
          cover_styles: Type.attachment_styles,
          subtitle: Type.string,
          slug: Type.string(description: "A human readable ID"),
          pending_slug: Type.string(description: "The requested slug"),
          section_kind: Type.string(description: "The label used for sections within the text. Values might be, for example, \"chapter\" or \"unit\""),
          title_formatted: Type.string,
          title_plaintext: Type.string,
          subtitle_formatted: Type.string,
          subtitle_plaintext: Type.string,
          description: Type.string,
          description_formatted: Type.string,
          toc: Type.array(items:
            Type.object(properties: {
                          label: Type.string,
                          anchor: Type.string,
                          type: Type.string,
                          id: Type.id,
                          children: Type.array(items:
                Type.object(properties: {
                              label: Type.string,
                              anchor: Type.string,
                              type: Type.string,
                              id: Type.id
                            }))
                        })),
          metadata: Type.object(properties: metadata),
          metadata_properties: Type.array(items: Type.string),
          metadata_formatted: Type.object(properties: metadata),
          citations: Type.object( properties: {
                                    apa: Type.string,
                                    mla: Type.string,
                                    chicago: Type.string
          }),
          spine: Type.array(items: Type.id),
          sections_map: Type.array(items:
                                    Type.object(properties: {
                                                    id: Type.id,
                                                    name: Type.string
                                                  }
                                    )

          ),
          abilities: Type.abilities,
          ingestion_source_download_url: Type.url,
          ingestion_external_source_url: Type.url,
        }.freeze

        PARTIAL_RELATIONSHIPS = [
          :project,
          :category
        ]

        RELATIONSHIPS = {
          project: Type.resource,
          category: Type.resource,
          stylesheets: Type.collection(contains: "stylesheets"),
          creators: Type.collection(contains: "creators"),
          contributors: Type.collection(contains: "contributors"),
          text_sections: Type.collection(contains: "text_sections"),
          toc_section: Type.resource
        }.freeze

        class << self

          include Resource

        end
      end
    end
  end
end
