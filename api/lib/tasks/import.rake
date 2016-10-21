require "pathname"

namespace :import do
  desc "Imports a project into Manifold"
  task :project, [:path, :include_texts, :log_level] => :environment do |_t, args|
    include_texts = args[:include_texts] == "no" ? false : true
    Importer::Project.new(args[:path]).import(include_texts)
  end

  desc "Imports all projects in a directory into Manifold"
  task :projects, [:path, :include_texts, :log_level] => :environment do |_t, args|
    include_texts = args[:include_texts] == "no" ? false : true
    children = Pathname.new(args[:path]).children.select(&:directory?)
    children.each do |child|
      Importer::Project.new(child).import(include_texts)
    end
  end
end
