class Settings < ApplicationRecord

  # Concerns
  include Attachments
  include Authority::Abilities
  include HasFormattedAttributes
  include SerializedAbilitiesFor

  SECTIONS = [:general, :integrations, :ingestion, :secrets, :email, :theme].freeze

  # rubocop/disable Layout/LineLength
  DEFAULTS = {
    general: {
      installation_name: "Manifold",
      head_title: "Manifold Scholarship",
      head_description: "Transforming scholarly publications into living digital works",
      social_share_message: "Shared from Manifold Scholarship",
      library_disabled: false,
      restricted_access: false,
      disable_engagement: false,
      disable_reading_groups: false,
      disable_internal_analytics: false
    },
    email: {
      from_address: "do-not-reply@manifoldapp.org",
      from_name: "Manifold Scholarship",
      reply_to_address: "do-not-reply@manifoldapp.org",
      reply_to_name: "Manifold Scholarship",
      closing: "Sincerely,\nThe Manifold Team",
      delivery_method: "sendmail"
    },
    theme: {
      string_cookies_banner_header: "Manifold uses cookies",
      string_cookies_banner_copy: "We use cookies to analyze our traffic. Please decide if you are willing to accept cookies from our website. You can change this setting anytime in [Privacy Settings](/privacy).",
      string_signup_terms_header: "First things first...",
      string_signup_terms_one: "When you create an account, we will collect and store your name and email address for account management purposes.",
      string_signup_terms_two: "This site will also store the annotations and highlights you create on texts, and it will keep track of content that you've starred. Depending on its configuration, this site may store anonymous data on how the site is being used.",
      string_data_use_header: "What data does Manifold store about me?",
      string_data_use_copy: <<~HEREDOC
Nulla quis lorem ut libero malesuada feugiat. Donec rutrum congue leo eget malesuada.

### INTERNAL ANALYTICS
Manifold stores anonymous data about what pages users access and how much time they spend on those pages. There is no personally identifiable information stored in relation to usage data.

### ANNOTATIONS AND COMMENTS
When you create a highlight, annotate a text, or write a comment, Manifold stores it in the database.

### READING GROUPS
Manifold stores basic information about each reading group, the content that has been collected in the group, and the group's members.
      HEREDOC
    },
    ingestion: {
      global_styles: "",
      mammoth_style_map: ""
    }
  }.freeze
  # rubocop/enable Layout/LineLength

  # Create merge setters for the various settings sections. Initialize the hashes.
  SECTIONS.each do |section|
    attribute section, :indifferent_hash, default: {}
    class_eval <<-RUBY, __FILE__, __LINE__ + 1
    def #{section}=(new_values)
      value = merge_settings_into!(:#{section}, new_values.symbolize_keys)
      write_attribute(:#{section}, value)
    end

    def force_#{section}=(value)
      write_attribute(:#{section}, value)
    end
    RUBY
  end

  # Validation
  validates :singleton_guard, inclusion: [0], uniqueness: true

  # Attachments
  manifold_has_attached_file :press_logo, :image
  manifold_has_attached_file :press_logo_footer, :image
  manifold_has_attached_file :press_logo_mobile, :image
  manifold_has_attached_file :favicon, :favicon

  has_formatted_attributes :copyright, include_wrap: false, container: :general
  has_formatted_attributes :restricted_access_body, include_wrap: false, container: :general
  has_formatted_attributes :string_data_use_copy, include_wrap: false, container: :theme
  has_formatted_attributes :string_cookies_banner_copy, include_wrap: false, container: :theme

  # Callbacks
  after_update :update_oauth_providers!
  after_initialize :ensure_defaults

  # @param [Symbol] section
  # @param [{Symbol => String}] new_values
  # @return [void]
  def merge_settings_into!(section, **new_values)
    current = self[section]
    # raise TypeError, "#{section} is not mergeable!" unless current.respond_to?(:merge)
    return unless current.respond_to?(:merge)

    self[section] = current.merge(new_values)
  end

  # @see [SettingsService::UpdateFromEnv]
  # @return [void]
  def update_from_environment!
    SettingsService::UpdateFromEnv.run! settings: self
  end

  # @see [SettingsService::UpdateOauthProviders]
  # @return [void]
  def update_oauth_providers!
    SettingsService::UpdateOauthProviders.run!
  end

  def calculated(current_user = nil)
    {
      has_visible_home_project_collections: ProjectCollection.by_visible_on_homepage.exists?,
      has_visible_projects: Project.with_read_ability(current_user).exists?,
      has_visible_journals: Journal.with_read_ability(current_user).exists?,
      has_project_collections: ProjectCollection.count.positive?,
      manifold_version: self.class.manifold_version,
      require_terms_and_conditions: Page.by_purpose(:terms_and_conditions).exists?,
      google_analytics_enabled: integrations["ga_tracking_id"].present?,
      manifold_analytics_enabled: integrations["disable_internal_analytics"] != true
    }
  end

  def ensure_defaults
    DEFAULTS.each do |section_key, section_defaults|
      section = send(section_key)
      section_defaults.each do |key, value|
        section[key] = value if section[key].blank?
      end
    end
  end

  class << self
    # Check if we {.update_from_environment? should update from the environment}
    # and {#update_from_environment! do so}.
    # @return [void]
    def potentially_update_from_environment!
      return unless update_from_environment?

      instance.update_from_environment!
    end

    # @return [Settings]
    def instance
      where(singleton_guard: 0).first_or_create!
    end

    # @!attribute [r] manifold_version
    # @!scope class
    # @see SettingsService::ReadManifoldVersion
    # @return [Gem::Version]
    def manifold_version
      @manifold_version ||= SettingsService::ReadManifoldVersion.run!
    end

    def require_terms_and_conditions?
      instance.calculated[:require_terms_and_conditions]
    end

    def google_analytics_enabled?
      instance.calculated[:google_analytics_enabled]
    end

    def manifold_analytics_enabled?
      instance.calculated[:manifold_analytics_enabled]
    end

    def update_from_environment?
      ENV["MANAGE_SETTINGS_FROM_ENV"].present? && table_exists?
    end
  end
end
