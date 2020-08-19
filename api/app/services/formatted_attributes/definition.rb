module FormattedAttributes
  class Definition
    include Equalizer.new(:attribute)

    attr_reader :attribute, :methods_module, :renderer_options, :container

    def initialize(attribute, include_wrap: true, renderer_options: nil, container: nil)
      @attribute = attribute
      @renderer_options = renderer_options || {
        filter_html: true,
        no_images: true,
        no_links: false,
        no_styles: true,
        hard_wrap: true
      }
      @include_wrap = include_wrap
      @container = container
      @methods_module = FormattedAttributes::Methods.new(self)
    end

    def include_wrap?
      @include_wrap.present?
    end

  end
end
