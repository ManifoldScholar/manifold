# frozen_string_literal: true

namespace :manifold do
  namespace :import do
    desc "Import random books from Standard Ebooks into Manifold"
    task :standard_ebooks, [:email, :count] => :environment do |_t, args|
      logger = Manifold::Rake.logger

      username = args[:email] || begin
        print "Enter your Standard Ebooks email (for OPDS authentication): "
        $stdin.gets.chomp
      end

      count = args[:count]&.to_i || begin
        print "How many books would you like to import? "
        $stdin.gets.chomp.to_i
      end

      if count < 1
        logger.error "Count must be at least 1"
        next
      end

      StandardEbooks::Populate.new(
        count: count,
        username: username,
        logger: logger
      ).call
    end

    desc "Import a specific book by title from Standard Ebooks"
    task :standard_ebook, [:email, :title] => :environment do |_t, args|
      logger = Manifold::Rake.logger

      username = args[:email] || begin
        print "Enter your Standard Ebooks email (for OPDS authentication): "
        $stdin.gets.chomp
      end

      title = args[:title] || begin
        print "Enter the book title: "
        $stdin.gets.chomp
      end

      if title.blank?
        logger.error "Title is required"
        next
      end

      StandardEbooks::Populate.new(
        title: title,
        username: username,
        logger: logger
      ).call
    end
  end
end
