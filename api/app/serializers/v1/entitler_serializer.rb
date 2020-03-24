module V1
  class EntitlerSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_belongs_to :entity, polymorphic: true

    typed_has_many :entitlements

    typed_attribute :name, Types::String.meta(example: "G.K. Chesteron", read_only: true)
  end
end
