# frozen_string_literal: true

# Remove PostgreSQL-specific \unrestrict and \restrict lines from structure.sql
# These lines cause merge conflicts because they contain random tokens that change
# with each dump in newer versions of PostgreSQL
#
# This workaround is only needed for Rails 7.0.x and 7.1.x
# Rails 7.2+ and 8.0+ have this fix built-in (see Rails PR #55510)
namespace :db do
  namespace :schema do
    desc 'Remove PostgreSQL-specific \unrestrict and \restrict lines from structure.sql'
    task remove_restrict_lines: :environment do
      # Check Rails version - this task should not be needed for Rails 7.2+
      if Rails.gem_version >= Gem::Version.new('7.2.0')
        raise 'This task is only needed for Rails 7.0.x and 7.1.x. ' \
                'Rails 7.2+ handles this automatically. Please remove this task.'
      end

      %w[db/structure.sql db/cache_structure.sql].each do |structure_file|
        next unless File.exist?(structure_file)

        content = File.read(structure_file)

        # Remove lines that start with \unrestrict or \restrict, along with any trailing empty lines
        cleaned_content = content.gsub(/^\\(?:un)?restrict\s+.*$\n+/, '')

        File.write(structure_file, cleaned_content)
      end
    end
  end
end

# Run the cleanup task after structure dump.
# In multi-database setups, db:migrate:<name> calls db:schema:dump:<name>,
# not db:schema:dump, so we need to enhance the database-specific tasks.
%w[db:schema:dump db:schema:dump:primary db:schema:dump:cache].each do |task_name|
  Rake::Task[task_name].enhance do
    Rake::Task['db:schema:remove_restrict_lines'].reenable
    Rake::Task['db:schema:remove_restrict_lines'].invoke
  end
end
