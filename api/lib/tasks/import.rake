require "pathname"

# rubocop:disable Metrics/BlockLength
namespace :import do
  desc "Imports a project into Manifold"
  task :project, [:path, :include_texts, :log_level] => :environment do |_t, args|
    cli_user = User.find_by(is_cli_user: true)
    include_texts = args[:include_texts] == "no" ? false : true
    logger = Logger.new(STDOUT)
    logger.formatter = proc { |severity, _datetime, _progname, msg|
      "#{severity.rjust(8)}: #{msg}\n"
    }
    Importer::Project.new(args[:path], cli_user, logger).import(include_texts)
  end

  desc "Imports a projects resource into Manifold from Google Drive"
  task :resources, [:path] => :environment do |_t, args|
    cli_user = User.find_by(is_cli_user: true)
    p_importer = Importer::Project.new(args[:path], cli_user)
    project_id, drive_sheet, drive_dir =
      p_importer.resource_import_options.values_at(:project_id, :drive_sheet, :drive_dir)
    logger = Logger.new(STDOUT)
    logger.formatter = proc { |severity, _datetime, _progname, msg|
      "#{severity.rjust(8)}: #{msg}\n"
    }
    importer = Importer::DriveResources.new(project_id, drive_sheet, drive_dir,
                                            cli_user, logger)
    importer.import
  end

  desc "Imports all projects in a directory into Manifold"
  task :projects, [:path, :include_texts, :log_level] => :environment do |_t, args|
    include_texts = args[:include_texts] == "no" ? false : true
    cli_user = User.find_by(is_cli_user: true)
    children = Pathname.new(args[:path]).children.select(&:directory?)
    logger = Logger.new(STDOUT)
    logger.formatter = proc { |severity, _datetime, _progname, msg|
      "#{severity.rjust(8)}: #{msg}\n"
    }
    children.each do |child|
      next if File.file?(File.join(child, ".skip"))
      Importer::Project.new(child, cli_user, logger).import(include_texts)
    end
  end
end
# rubocop:enable Metrics/BlockLength
