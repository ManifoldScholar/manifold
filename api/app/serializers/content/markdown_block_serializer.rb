module Content
  class MarkdownBlockSerializer < ::ContentBlockSerializer
    attributes :body, :body_formatted, :style
  end
end
