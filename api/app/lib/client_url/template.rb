module ClientURL
  class Template
    def initialize(uri, client_url: Rails.configuration.manifold.url)
      @client_url = client_url
      @uri = uri.to_s.gsub(%r{\A/}, "")
      @full_url = @uri.start_with?("http") ? uri : "#{@client_url}/#{@uri}"
      @template = Addressable::Template.new @full_url
    end

    def call(**options)
      @template.expand(options).to_s
    end
  end
end
