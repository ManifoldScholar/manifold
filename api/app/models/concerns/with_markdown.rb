module WithMarkdown
  extend ActiveSupport::Concern

  def render_simple_markdown(input)
    return input if input.blank?
    options = {
      filter_html: true,
      no_images: true,
      no_links: true,
      no_styles: true
    }
    renderer = Redcarpet::Render::HTML.new(options)
    redcarpet = Redcarpet::Markdown.new(renderer)
    out = redcarpet.render(input)
    Regexp.new(%r{\A<p>(.*)<\/p>\Z}).match(out)[1]
  end
end
