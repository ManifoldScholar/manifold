module Content
  class TableOfContentsBlockSerializer < ::ContentBlockSerializer
    attributes :depth, :title, :show_authors, :show_text_title

    has_one :text
  end
end
