module WithMarkdown
  extend ActiveSupport::Concern

  def render_simple_markdown(input, include_wrap = true)
    SimpleFormatter.run! input: input, include_wrap: include_wrap
  end
end
