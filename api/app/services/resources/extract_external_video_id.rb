module Resources
  class ExtractExternalVideoId < ActiveInteraction::Base
    string :external_id
    string :external_type

    def execute
      return unless external_id.present?
      return external_id unless preformatted.start_with?("http")

      extracted.presence || errors.add(:external_id, "is an invalid format for #{external_type}")
    end

    private

    def extracted
      case external_type
      when "youtube"
        youtube_short? ? parsed_url_path : parsed_url_params.fetch(:v, nil)
      when "vimeo"
        parsed_url_path
      end
    end

    def preformatted
      return "https://#{external_id}" if external_id.start_with?("vimeo.com", "youtube.com", "youtu.be")

      external_id
    end

    def youtube_short?
      parsed_url.host == "youtu.be"
    end

    def parsed_url
      @parsed_url ||= URI.parse(preformatted)
    end

    def parsed_url_path
      @parsed_url_path ||= parsed_url.path[1..]
    end

    def parsed_url_params
      @parsed_url_params ||= Rack::Utils.parse_nested_query(parsed_url.query).with_indifferent_access
    end

  end
end
