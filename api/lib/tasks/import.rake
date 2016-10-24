require "pathname"

namespace :import do
  desc "Imports a project into Manifold"
  task :project, [:path, :include_texts, :log_level] => :environment do |_t, args|
    cli_user = User.find_by(is_cli_user: true)
    include_texts = args[:include_texts] == "no" ? false : true
    Importer::Project.new(args[:path], cli_user).import(include_texts)
  end

  desc "Imports all projects in a directory into Manifold"
  task :projects, [:path, :include_texts, :log_level] => :environment do |_t, args|
    include_texts = args[:include_texts] == "no" ? false : true
    cli_user = User.find_by(is_cli_user: true)
    children = Pathname.new(args[:path]).children.select(&:directory?)
    children.each do |child|
      Importer::Project.new(child, cli_user).import(include_texts)
    end
  end
end
