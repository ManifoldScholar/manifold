# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= "test"
require "spec_helper"

require "simplecov"

SimpleCov.start "rails" do
  project_name "Manifold"

  enable_coverage :branch

  add_filter "app/models/concerns/arel_helpers.rb"
  add_filter "app/services/system_upgrades/upgrades"
  add_filter "app/services/demonstration"
  add_filter "app/services/importer"
  add_filter "app/services/testing"
  add_filter "lib/generators"
  add_filter "lib/paperclip_migrator.rb"
  add_filter "lib/patches/better_enums.rb"
  add_filter "lib/patches/better_interactions.rb"
  add_filter "lib/templates"

  add_group "Authorizers", %w[
    app/authorizers
  ]

  add_group "Decorators", %w[
    app/decorators
  ]

  add_group "Enums", %w[app/enums]

  add_group "Fingerprinting", %w[
    app/jobs/fingerprints
    app/models/concerns/calculates_fingerprints.rb
    app/models/concerns/stores_fingerprints.rb
    app/services/collaborators/calculate_fingerprint.rb
    app/services/fingerprints
    app/services/fingerprints.rb
    app/services/texts/calculate_fingerprint.rb
    app/services/text_sections/calculate_fingerprint.rb
    app/services/text_titles/calculate_fingerprint.rb
  ]

  add_group "Ingestion", %w[
    app/models/ingestion.rb
    app/models/ingestion_source.rb
    app/services/ingestions
  ]

  add_group "Packaging", %w[
    app/enums/core_media_type_kind.rb
    app/enums/export_kind.rb
    app/enums/referenced_path_strategy.rb
    app/enums/source_node_kind.rb
    app/jobs/packaging
    app/jobs/text_exports/prune_job.rb
    app/jobs/texts/automate_exports_job.rb
    app/models/cached_external_source.rb
    app/models/cached_external_source_link.rb
    app/models/text_export.rb
    app/models/text_export_status.rb
    app/services/cached_external_sources
    app/services/html_nodes
    app/services/packaging
    app/services/text_exports/prune.rb
    app/services/texts/automate_exports.rb
    app/services/epub_check.rb
  ]

  add_group "Patches", %w[lib/patches]

  add_group "Serializers", %w[app/serializers]

  add_group "Services", %w[app/services]
end

require File.expand_path("../config/environment", __dir__)

require "rspec/rails"
require "test_prof/recipes/rspec/let_it_be"
require "test_prof/recipes/rspec/factory_default"
require "webmock/rspec"
require "dry/system/stubs"
require "closure_tree/test/matcher"
require "scanf"
require "with_model"

Dry::Effects.load_extensions :rspec

# Requires supporting ruby files with custom matchers and macros, etc, in
# spec/support/ and its subdirectories. Files matching `spec/**/*_spec.rb` are
# run as spec files by default. This means that files in spec/support that end
# in _spec.rb will both be required and run as specs, causing the specs to be
# run twice. It is recommended that you do not name files matching this glob to
# end with _spec.rb. You can configure this pattern with the --pattern
# option on the command line or in ~/.rspec, .rspec or `.rspec-local`.
#
# The following line is provided for convenience purposes. It has the downside
# of increasing the boot-up time by auto-requiring all files in the support
# directory. Alternatively, in the individual `*_spec.rb` files, manually
# require only the support files necessary.
#
# Dir[Rails.root.join("spec/support/**/*.rb")].each { |f| require f }
Dir[File.dirname(__FILE__) + "/support/**/*.rb"].each { |f| require f }

# Checks for pending migrations before tests are run.
# If you are not using ActiveRecord, you can remove this line.
ActiveRecord::Migration.maintain_test_schema!

ActiveJob::Uniqueness.test_mode!

TestProf::FactoryDefault.configure do |config|
  config.preserve_attributes = true
  config.preserve_traits = true
end

Rails.application.eager_load!

RSpec.configure do |config|
  config.include TestHelpers
  config.extend WithModel

  config.alias_it_should_behave_like_to :the_subject_behaves_like, "the subject's"

  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_path = "#{::Rails.root}/spec/fixtures"

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  # RSpec Rails can automatically mix in different behaviours to your tests
  # based on their file location, for example enabling you to call `get` and
  # `post` in specs under `spec/controllers`.
  #
  # You can disable this behaviour by removing the line below, and instead
  # explicitly tag your specs with their type, e.g.:
  #
  #     RSpec.describe UsersController, :type => :controller do
  #       # ...
  #     end
  #
  # The different available types are documented in the features, such as in
  # https://relishapp.com/rspec/rspec-rails/docs
  config.infer_spec_type_from_file_location!

  config.include ActiveJob::TestHelper

  # Clean up any jobs before each run.
  config.before(:each) do
    clear_enqueued_jobs
  end

  config.after do
    RequestStore.clear!
  end

  config.before(:suite) do
    ManifoldApi::Container.enable_stubs!
  end

  # Set up jsonapi request encoder
  config.before(:suite) do
    ActionDispatch::IntegrationTest.register_encoder(
      :jsonapi,
      param_encoder: ->(value) { JSON.stringify(value) },
      response_parser: ->(value) { JSON.parse(value) }
    )
  end

  # Truncate all test database tables before running tests.
  config.before(:suite) do
    DatabaseCleaner[:active_record].strategy = :transaction
    DatabaseCleaner[:redis].strategy = :deletion

    DatabaseCleaner[:active_record].clean_with(:truncation)
    DatabaseCleaner[:redis].clean_with(:deletion)

    Scenic.database.views.select(&:materialized).each do |view|
      Scenic.database.refresh_materialized_view view.name, concurrently: false, cascade: false
    end
  end

  config.after(:suite) do
    ingestion_dir = Ingestions::Concerns::FileOperations::WORKING_DIR_BASE

    next unless File.directory? ingestion_dir

    ingestion_dir.each_child(&:rmtree)
  end

  config.before(:suite) do
    Searchkick.disable_callbacks
  end

  allowed_net_connect = [
    /googleapis\.com/
  ]

  # config.around(:each, elasticsearch: true) do |example|
  #   WebMock.allow_net_connect!
  #   Searchkick.callbacks(nil) do
  #     example.run
  #   end
  #   WebMock.disable_net_connect!(allow: allowed_net_connect)
  # end

  # Allow elastic search for tests tagged with elasticsearch

  config.around(:example) do |example|
    disable_web_connect = !example.metadata[:elasticsearch]

    if disable_web_connect
      WebMock.disable_net_connect!(allow: allowed_net_connect)
    else
      WebMock.allow_net_connect!
    end

    example.run
  end
end
