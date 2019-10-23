module ApiDocs
  module Definition
    module Resource
      class Comment

        READ_ONLY = [:parent_id, :abilities, :created_at, :flags_count, :children_count,
                     :author_created].freeze

        WRITE_ONLY = [].freeze

        ATTRIBUTES = {
          body: Type.string,
          parent_id: Type.id,
          created_at: Type.date_time,
          flags_count: Type.integer,
          flagged: Type.boolean,
          abilities: Type.abilities,
          deleted: Type.boolean,
          children_count: Type.integer,
          sort_order: Type.integer,
          author_created: Type.boolean
        }.freeze

        RELATIONSHIPS = {
          creator: Type.resource
        }.freeze

        class << self

          include Resource

          def create_attributes
            request_attributes.except(:deleted)
          end

        end
      end
    end
  end
end
