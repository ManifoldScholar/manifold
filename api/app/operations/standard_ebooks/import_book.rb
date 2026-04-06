# frozen_string_literal: true

require "net/http"
require "tempfile"

module StandardEbooks
  class ImportBook
    def initialize(entry:, user:, logger:, username:)
      @entry = entry
      @user = user
      @logger = logger
      @username = username
    end

    def call
      epub_tempfile = download_file(@entry[:epub_url], "standard_ebooks", ".epub")
      cover_tempfile = download_file(@entry[:cover_url], "standard_ebooks_cover", ".jpg") if @entry[:cover_url].present?

      project = nil

      ApplicationRecord.transaction do
        project = create_project
        text = ingest_epub(project, epub_tempfile)

        unless text
          @logger.error "Unable to ingest EPUB for \"#{@entry[:title]}\""
          raise ActiveRecord::Rollback
        end

        finalize_project(project, text)
      end

      set_cover_image(project, cover_tempfile) if project&.persisted? && cover_tempfile

      project
    ensure
      epub_tempfile&.close!
      cover_tempfile&.close!
    end

    private

    def create_project
      Project.create!(
        title: @entry[:title],
        creator: @user,
        draft: false
      ).tap do |project|
        @logger.info "  Created project #{project.id}"
      end
    end

    def ingest_epub(project, tempfile)
      ingestion = Ingestions::CreateManually.run(
        project: project,
        source: tempfile,
        creator: @user
      ).result

      @logger.info "  Running ingestion..."
      outcome = Ingestions::Ingestor.run(ingestion: ingestion, logger: @logger)
      outcome.result if outcome.valid?
    end

    def finalize_project(project, text)
      @logger.info "  Created #{'published ' if text.published?}text \"#{text.title}\""

      project.title = text.title
      project.pending_slug = text.title
      project.description = @entry[:summary] if @entry[:summary].present?
      project.save!

      @logger.info "  Updated project title and slug"

      Content::ScaffoldProjectContent.run(project: project, kind: "one_text")

      if project.content_blocks.any? && project.texts.any?
        ContentBlockReference.create!(
          content_block: project.content_blocks.first,
          referencable: project.texts.first,
          kind: "text"
        )
      end

      @logger.info "  Scaffolded project content blocks"
    end

    def set_cover_image(project, tempfile)
      tempfile.rewind
      project.avatar = tempfile
      project.save!
      @logger.info "  Set project cover image"
    rescue StandardError => e
      @logger.warn "  Failed to set cover image: #{e.message}"
    end

    def download_file(url, prefix, extension)
      uri = URI(url)
      response = fetch_with_redirects(uri)

      tempfile = Tempfile.new([prefix, extension])
      tempfile.binmode
      tempfile.write(response.body)
      tempfile.rewind
      tempfile
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
        raise "Failed to download #{uri}: #{response.code} #{response.message}"
      end
    end
  end
end
