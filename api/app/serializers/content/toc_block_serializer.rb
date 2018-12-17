module Content
  class TOCBlockSerializer < ::ContentBlockSerializer
    attributes :depth, :show_authors, :show_text_title

    has_one :text
  end
end
