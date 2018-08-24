module ClientURL
  class Map
    def initialize
      @map = {}.with_indifferent_access
    end

    def [](key)
      @map.fetch(key) do
        raise "Unknown client url key: #{key}"
      end
    end

    def add(key, uri)
      @map[key] = ClientURL::Template.new(uri)
    end

    def call(key, **options)
      self[key].call(**options)
    end
  end
end
