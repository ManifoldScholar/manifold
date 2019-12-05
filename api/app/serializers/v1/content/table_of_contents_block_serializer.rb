module V1
  module Content
    class TableOfContentsBlockSerializer < ContentBlockSerializer

      typed_attribute :depth, NilClass
      typed_attribute :title, NilClass
      typed_attribute :show_authors, NilClass
      typed_attribute :show_text_title, NilClass
      typed_has_one :text

    end
  end
end
