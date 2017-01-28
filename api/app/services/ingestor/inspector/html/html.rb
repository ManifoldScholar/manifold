require "fileutils"
require "zip"
require "memoist"
require "uri"
require "open-uri"
require "json"
require "pathname"
require "digest/md5"

module Ingestor
  module Inspector
    module HTML
      module HTML
        include Ingestor::Loggable
        include Ingestor::Inspector::Helpers
        extend Memoist

        def basename
          File.basename(@html_path, ".*")
        end

        def language
          "en"
        end

        def rights
          ""
        end

        def description
          ""
        end

        def allowed_file_types
          # rubocop:disable Metrics/LineLength
          Rails.application.config.x.api[:attachments][:validations][:resource][:allowed_ext]
          # rubocop:enable Metrics/LineLength
        end

        def relative_path(path)
          Pathname.new(path)
        end

        def stylesheet_inspectors
          [
            ::Ingestor::Inspector::HTML::Stylesheet.new(
              stylesheet,
              self
            )
          ]
        end

        def get_contents_from_path(path)
          Nokogiri::HTML(File.open(path), nil, "utf-8")
        end
        memoize :get_contents_from_path

        def stylesheet
          get_contents_from_path(@html_path).at("//style").to_html
        end

        def cover(_text)
          nil
        end

        def toc
          []
        end

        def landmarks
          []
        end

        def page_list
          []
        end

        def start_section_identifier
          nil
        end
      end
    end
  end
end
