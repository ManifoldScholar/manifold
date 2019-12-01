module V1
  module Content
    class MarkdownBlockSerializer < ContentBlockSerializer
      attributes :body, :body_formatted, :style
    end
  end
end
