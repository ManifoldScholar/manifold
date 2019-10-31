# Validate an epub and record errors / warnings.
#
# @see https://github.com/w3c/epubcheck
class EpubCheck < ActiveInteraction::Base
  # @api private
  JAR_PATH = Rails.root.join("lib", "epubcheck", "epubcheck.jar").freeze

  # @api private
  TMP_BASE_NAME = %w[epubcheck .json].freeze

  set_callback :execute, :around, :with_tempfile!

  string :epub_path

  validate :epubcheck_exists!
  validate :epub_path_exists!

  # @return [Hash]
  def execute
    line = Terrapin::CommandLine.new(
      "java",
      "-jar :jar_path :epub_path --json :output_path --quiet",
      # epubcheck returns non-zero if it finds an error
      expected_outcodes: [0, 1],
      swallow_stderr: true
    )

    line.run(jar_path: JAR_PATH, epub_path: epub_path, output_path: @tempfile.path)
  rescue Terrapin::CommandNotFoundError => e
    errors.add :base, "Could not run epubcheck because of missing java: #{e.message}"
  rescue Terrapin::ExitStatusError => e
    errors.add :base, "Could not run epubcheck: #{e.message}"
  else
    parse_tempfile!
  end

  private

  # @return [void]
  def epubcheck_exists!
    errors.add :base, "#{JAR_PATH} does not exist" unless JAR_PATH.exist?
  end

  # @return [void]
  def epub_path_exists!
    errors.add :base, "#{epub_path} does not exist" unless File.exist?(epub_path)
  end

  def parse_tempfile!
    content = File.read @tempfile.path

    JSON.parse content
  rescue JSON::ParserError => e
    errors.add :base, "Could not parse epubcheck response JSON: #{e.message}"

    return nil
  end

  # @return [void]
  def with_tempfile!
    Tempfile.open(TMP_BASE_NAME, Rails.root.join("tmp")) do |f|
      @tempfile = f

      yield
    end
  end
end
