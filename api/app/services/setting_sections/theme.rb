# frozen_string_literal: true

module SettingSections
  # Settings related to theming the Manifold installation.
  class Theme < Base
    DEFAULT_STRING_DATA_USE_COPY = <<~HEREDOC
    ## Internal Analytics
    Manifold stores anonymous data about what pages users access and how much time they spend on those pages. There is no personally identifiable information stored in relation to usage data.

    ## Annotations and Comments
    When you create a highlight, annotate a text, or write a comment, Manifold stores it in the database.

    ## Reading Groups
    Manifold stores basic information about each reading group, the content that has been collected in the group, and the group's members.
    HEREDOC

    attribute :string_signup_terms_header, :string, default: "First things first..."
    attribute :string_signup_terms_one, :string, default: "When you create an account, we will collect and store your name and email address for account management purposes."
    attribute :string_signup_terms_two, :string, default: "This site will also store the annotations and highlights you create on texts, and it will keep track of content that you've starred. Depending on its configuration, this site may store anonymous data on how the site is being used."
    attribute :string_data_use_header, :string, default: "What data does Manifold store about me?"
    attribute :string_data_use_copy, :string, default: DEFAULT_STRING_DATA_USE_COPY
    attribute :string_cookies_banner_header, :string, default: "Manifold uses cookies"
    attribute :string_cookies_banner_copy, :string, default: "We use cookies to analyze our traffic. Please decide if you are willing to accept cookies from our website. You can change this setting anytime in [Privacy Settings](/privacy)."

    attribute :logo_styles, :string
    attribute :typekit_id, :string
    attribute :header_offset, :string
    attribute :top_bar_text, :string
    attribute :top_bar_url, :string
    attribute :top_bar_color, :string
    attribute :top_bar_mode, :string
    attribute :accent_color, :string
    attribute :header_foreground_color, :string
    attribute :header_foreground_active_color, :string
    attribute :header_background_color, :string
  end
end
