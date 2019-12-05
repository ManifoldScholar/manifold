module V1
  class ErrorSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    set_id :id
    attr_accessor :with_root_key

    typed_attribute :id, NilClass
    typed_attribute :detail, NilClass
    typed_attribute :source, NilClass
    typed_attribute :title, NilClass

    def initialize(resource, options = {})
      super
      @with_root_key = options[:with_root_key] != false
    end

    # Based on https://github.com/Netflix/fast_jsonapi/issues/102#issuecomment-409984054
    def hash_for_one_record
      serialized_hash = super[:data]
      !with_root_key ? serialized_hash : { errors: serialized_hash }
    end

    # Based on https://github.com/Netflix/fast_jsonapi/issues/102#issuecomment-409984054
    def hash_for_collection
      serialized_hash = super[:data]&.map { |err| err[:attributes] }
      !with_root_key ? serialized_hash : { errors: serialized_hash }
    end

  end
end
