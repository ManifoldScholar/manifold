require "redcarpet/compat"

module WithMarkdown
  extend ActiveSupport::Concern

  # rubocop:disable Lint/HandleExceptions
  # rubocop:disable Style/RegexpLiteral
  class RenderWithoutWrap < ::Redcarpet::Render::HTML
    def postprocess(full_document)
      Regexp.new(/\A<p>(.*)<\/p>\Z/m).match(full_document)[1]
    rescue full_document
    end
  end
  # rubocop:enable Style/RegexpLiteral
  # rubocop:enable Lint/HandleExceptions Style/RegexpLiteral

  def render_simple_markdown(input, include_wrap = true)
    return input if input.blank?
    options = {
      filter_html: true,
      no_images: true,
      no_links: true,
      no_styles: true,
      hard_wrap: false
    }

    renderer = RenderWithoutWrap.new(options)
    renderer = Redcarpet::Render::HTML.new(options) if include_wrap
    redcarpet = Redcarpet::Markdown.new(renderer)
    out = redcarpet.render(input).strip
    out
  end
end
