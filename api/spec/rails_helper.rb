# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= "test"
require "spec_helper"

require File.expand_path("../config/environment", __dir__)

require "rspec/rails"
require "webmock/rspec"
require "database_cleaner"
require "closure_tree/test/matcher"
require "scanf"
require "with_model"

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
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.clean_with(:deletion)
  end

  config.after(:suite) do
    ingestion_dir = Ingestions::Concerns::FileOperations::WORKING_DIR_BASE

    next unless File.directory? ingestion_dir

    ingestion_dir.each_child(&:rmtree)
  end

  # Allow elastic search for tests tagged with elasticsearch
  config.around(:all) do |example|
    if example.metadata[:elasticsearch]
      WebMock.disable_net_connect!(allow: /127\.0\.0\.1:2?9200/)
      example.run
    else
      stub_request(:any, /127\.0\.0\.1:2?9200/)
      WebMock.disable_net_connect!(allow: /googleapis\.com/)
      example.run
    end
  end
end
