module V1
  module Content
    class MarkdownBlockSerializer < ContentBlockSerializer
      typed_attribute :body, NilClass
      typed_attribute :body_formatted, NilClass
      typed_attribute :style, NilClass
    end
  end
end
