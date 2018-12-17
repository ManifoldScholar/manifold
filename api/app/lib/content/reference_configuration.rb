module Content
  class ReferenceConfiguration
    attr_reader :name, :required, :multiple, :source

    def initialize(name:, required:, multiple:, source:)
      @name = name
      @required = required
      @multiple = multiple
      @source = source
    end
  end
end
