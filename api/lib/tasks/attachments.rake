namespace :manifold do
  namespace :attachments do
    desc <<~HEREDOC.strip
      Replaces attachments in :cache storage with matching files.
      Searches the provided class for attachments in :cache based on filenames present in replacement directory.
      Can be run without making changes by passing true for dry_run.
    HEREDOC
    task :replace, [:replacement_dir_path, :class_name, :attachment_field_name, :dry_run] => :environment do |_t, args|
      Attachments::FileReplacer.run! replacement_dir: args[:replacement_dir_path],
                                     klass_name: args[:class_name],
                                     field_name: args[:attachment_field_name],
                                     dry_run: args[:dry_run],
                                     logger: Manifold::Rake.logger
    end
  end
end
