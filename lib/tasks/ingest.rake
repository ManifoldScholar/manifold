namespace :ingest do

  desc "Ingests a single text into Manifold"
  task :text, [:path, :log_level] => :environment do |t, args|
    ingest(args.path, args.log_level)
  end

  desc "Ingests EPUB3 files in /epubs into Manifold"
  task :batch, [:log_level] => :environment do |t, args|
    epubs = Dir["epubs/*"]
    epubs.each do |epub|
      ingest(epub, :debug)
    end
  end

  def ingest(path, log_level)
    path ||= fail "A path to an ingestable file must be provided: `rake manifold:ingest[PATH]`"
    log_level ||= 'info'
    Ingestor.logger = Logger.new(STDOUT)
    Ingestor.logger.level = Logger.const_get(log_level.upcase.to_sym)
    Ingestor.ingest(path)
    Ingestor.reset_logger()
  end

end
