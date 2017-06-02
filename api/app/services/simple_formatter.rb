class SimpleFormatter < ActiveInteraction::Base
  string :input, default: ""

  boolean :include_wrap, default: true

  hash :renderer_options, default: proc { {} } do
    boolean :filter_html, default: true
    boolean :no_images, default: true
    boolean :no_links, default: true
    boolean :no_styles, default: true
    boolean :hard_wrap, default: true
  end

  # @return [String]
  def execute
    return input if input.blank?

    markdown = initialize_markdown

    markdown.render(input).strip
  end

  private

  def initialize_markdown
    Redcarpet::Markdown.new(initialize_renderer)
  end

  def initialize_renderer
    renderer_klass.new(renderer_options)
  end

  def renderer_klass
    include_wrap ? Redcarpet::Render::HTML : RenderWithoutWrap
  end
end
