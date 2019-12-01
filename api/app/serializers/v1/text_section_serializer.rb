module V1
  class TextSectionSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    make_partial_by_default

    attributes :text_slug,
               :text_title,
               :name,
               :social_image,
               :source_identifier,
               :kind

    belongs_to :text
    has_many :stylesheets

    full_attributes :body_json do |object, _params|
      camelize_hash(object.body_json)
    end

    full_attributes :citations do |object, _params|
      camelize_hash(object.body_json)
    end

  end
end
