# frozen_string_literal: true

require "net/http"
require "nokogiri"

module StandardEbooks
  class FetchCatalog
    BASE_URL = "https://standardebooks.org"
    FEED_PATH = "/opds/all"

    EPUB_TYPE = "application/epub+zip"
    ACQUISITION_REL = "opds-spec.org/acquisition"
    IMAGE_REL = "http://opds-spec.org/image"
    THUMBNAIL_REL = "http://opds-spec.org/image/thumbnail"
    NEXT_REL = "next"
    ATOM_NS = "http://www.w3.org/2005/Atom"

    def initialize(username:)
      @username = username
    end

    def call
      entries = []
      url = URI.join(BASE_URL, FEED_PATH)

      loop do
        doc = fetch_and_parse(url)
        entries.concat(extract_entries(doc))

        next_link = doc.at_xpath("//xmlns:feed/xmlns:link[@rel='#{NEXT_REL}']", "xmlns" => ATOM_NS)
        break unless next_link

        url = URI.join(BASE_URL, next_link["href"])
      end

      entries
    end

    private

    def fetch_and_parse(url)
      response = fetch_with_redirects(URI(url))
      Nokogiri::XML(response.body)
    end

    def fetch_with_redirects(uri, limit = 5)
      raise "Too many redirects fetching #{uri}" if limit == 0

      response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") do |http|
        request = Net::HTTP::Get.new(uri)
        request.basic_auth(@username, "")
        http.request(request)
      end

      case response
      when Net::HTTPSuccess
        response
      when Net::HTTPRedirection
        location = response["location"]
        redirect_uri = location.start_with?("http") ? URI(location) : URI.join("#{uri.scheme}://#{uri.host}", location)
        fetch_with_redirects(redirect_uri, limit - 1)
      else
        raise "Failed to fetch OPDS feed at #{uri}: #{response.code} #{response.message}"
      end
    end

    def extract_entries(doc)
      doc.xpath("//xmlns:entry", "xmlns" => ATOM_NS).map do |entry|
        parse_entry(entry)
      end.compact
    end

    def parse_entry(entry)
      title = entry.at_xpath("xmlns:title", "xmlns" => ATOM_NS)&.text
      author = entry.at_xpath("xmlns:author/xmlns:name", "xmlns" => ATOM_NS)&.text
      summary = entry.at_xpath("xmlns:summary", "xmlns" => ATOM_NS)&.text

      epub_link = entry.xpath("xmlns:link", "xmlns" => ATOM_NS).find do |link|
        link["rel"]&.include?(ACQUISITION_REL) && link["type"] == EPUB_TYPE
      end

      return nil unless title && epub_link

      epub_href = epub_link["href"]
      epub_url = epub_href.start_with?("http") ? epub_href : URI.join(BASE_URL, epub_href).to_s

      links = entry.xpath("xmlns:link", "xmlns" => ATOM_NS)
      cover_link = links.find { |l| l["rel"] == IMAGE_REL } ||
                   links.find { |l| l["rel"] == THUMBNAIL_REL }
      cover_url = if cover_link
                    href = cover_link["href"]
                    href.start_with?("http") ? href : URI.join(BASE_URL, href).to_s
                  end

      {
        title: title.strip,
        author: author&.strip,
        summary: summary&.strip,
        epub_url: epub_url,
        cover_url: cover_url
      }
    end
  end
end
