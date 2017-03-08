# rubocop:disable Metrics/BlockLength
namespace :ingest do
  desc "Ingests a single text into Manifold"
  task :text, [:path, :log_level] => :environment do |_t, args|
    ingest(args.path, args.log_level)
  end

  desc "Ingests EPUB3 files in /texts into Manifold"
  task :texts, [:log_level] => :environment do |_t, _args|
    epubs = Dir["../texts/*"]
    epubs.reject { |epub| epub.start_with?("../DS") }.each do |epub|
      puts epub
      ingest(epub, :debug)
    end
  end

  desc "Ingests EPUB3 files in /user_texts into Manifold"
  task :user_texts, [:log_level] => :environment do |_t, _args|
    epubs = Dir["../user_texts/*"]
    epubs.reject { |epub| epub.start_with?("../DS") }.each do |epub|
      puts epub
      ingest(epub, :debug)
    end
  end

  desc "Ingests EPUB3 files in /spec/data/epubs/v3 into Manifold"
  task :specpubs, [:log_level] => :environment do |_t, _args|
    puts Ingestor::Strategy.strategies.inspect
    epubs = Dir["spec/data/epubs/v3/*"]
    epubs.each do |epub|
      ingest(epub, :debug)
    end
  end

  def ingest(path, log_level)
    path ||= raise I18n.t("rake.ingest.errors.missing_path")
    log_level ||= "info"
    Ingestor.logger = Logger.new(STDOUT)
    Ingestor.logger.level = Logger.const_get(log_level.upcase.to_sym)
    cli_user = User.find_by(is_cli_user: true)
    Ingestor.ingest(path, cli_user)
    Ingestor.reset_logger
  end
end
# rubocop:enable Metrics/BlockLength
