module V1
  class TwitterQuerySerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :created_at, NilClass
    typed_attribute :updated_at, NilClass
    typed_attribute :query, NilClass
    typed_attribute :active, NilClass
    typed_attribute :events_count, NilClass
    typed_attribute :result_type, NilClass
    typed_attribute :display_name, NilClass

    typed_belongs_to :project
  end
end
