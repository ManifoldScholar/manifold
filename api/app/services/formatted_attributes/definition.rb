module FormattedAttributes
  class Definition
    include Equalizer.new(:attribute)

    attr_reader :attribute
    attr_reader :methods_module

    def initialize(attribute, include_wrap: true)
      @attribute = attribute
      @include_wrap = include_wrap
      @methods_module = FormattedAttributes::Methods.new(self)
    end

    def include_wrap?
      @include_wrap.present?
    end
  end
end
