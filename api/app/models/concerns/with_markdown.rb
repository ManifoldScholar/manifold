module WithMarkdown
  extend ActiveSupport::Concern

  def render_simple_markdown(input)
    return input if input.blank?
    options = {
      filter_html: true,
      no_images: true,
      no_links: true,
      no_styles: true,
      hard_wrap: true
    }
    renderer = Redcarpet::Render::HTML.new(options)
    redcarpet = Redcarpet::Markdown.new(renderer)
    redcarpet.render(input).strip
  end
end
