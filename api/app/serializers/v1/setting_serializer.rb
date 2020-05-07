module V1
  class SettingSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    set_id :singleton_guard

    typed_attribute :general, Types::Hash.schema(
      installation_name: Types::String,
      default_publisher: Types::String,
      default_publisher_place: Types::String,
      head_description: Types::String,
      social_share_message: Types::String,
      contact_email: Types::Serializer::Email,
      copyright: Types::String,
      press_site: Types::String,
      terms_url: Types::Serializer::URL,
      head_tile: Types::String,
      twitter: Types::String,
      facebook: Types::String,
      library_disabled: Types::Bool,
      all_standalone: Types::Bool,
      library_redirect_url: Types::String,
      home_redirect_url: Types::String,
      restricted_access: Types::Bool,
      restricted_access_heading: Types::String,
      restricted_access_body: Types::String,
      disable_engagement: Types::Bool,
      disable_reading_groups: Types::Bool
    )
    typed_attribute :theme, Types::Hash.schema(
      logo_styles: Types::String,
      typekit_id: Types::String,
      header_offset: Types::String,
      top_bar_text: Types::String,
      top_bar_url: Types::String,
      top_bar_color: Types::String,
      top_bar_mode: Types::String,
      accent_color: Types::String,
      header_foreground_color: Types::String,
      header_foreground_active_color: Types::String,
      header_background_color: Types::String
    )
    typed_attribute :integrations, Types::Hash.schema(
      facebook_app_id: Types::String,
      twitter_app_id: Types::String,
      twitter_access_token: Types::String,
      google_project_id: Types::String,
      google_private_key_id: Types::String,
      google_client_email: Types::String,
      google_client_id: Types::String,
      ga_tracking_id: Types::String,
      ga_profile_id: Types::String.meta(example: "ga:343245632")
    )
    typed_attribute :email, Types::Hash.schema(
      from_address: Types::Serializer::Email,
      from_name: Types::String,
      reply_to_address: Types::Serializer::Email,
      reply_to_name: Types::String,
      closing: Types::String,
      delivery_method: Types::String.enum("sendmail"),
      smtp_settings_address: Types::String,
      smtp_settings_port: Types::Integer,
      smtp_settings_user_name: Types::String,
      sendmail_settings_location: Types::String,
      sendmail_settings_arguments: Types::String
    )
    typed_attribute :press_logo_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :press_logo_footer_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :press_logo_mobile_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :favicon_styles, Types::Hash.schema(
      small: Types::Serializer::URL,
      medium: Types::Serializer::URL,
      large: Types::Serializer::URL,
      original: Types::Serializer::URL
    ).meta(read_only: true)
    typed_attribute :copyright_formatted, Types::String.meta(read_only: true)
    typed_attribute :calculated, Types::Hash.schema(
      hasVisibleHomeProjectCollections: Types::Bool,
      hasVisibleProjects: Types::Bool,
      manifoldVersion: Types::Hash.schema(
        version: Types::String,
        segments: Types::Array.of(Types::Integer).optional.meta(
          description: "An array of integers representing the major, minor and patch version. "\
          "This will default to null if the version does not adhere to a semantic versioning format."
        )
      )
    ).meta(read_only: true) do |object, params|
      object.calculated(params[:current_user])
    end

    typed_attribute :oauth, Types::Hash.schema(
      facebook: Types::Serializer::Oauth,
      googleOauth2: Types::Serializer::Oauth,
      twitter: Types::Serializer::Oauth
    ).meta(read_only: true) do |_object, _params|
      ManifoldEnv.oauth.as_json
    end

    typed_attribute :secrets, Types::Hash.schema(
      facebook_app_secret: Types::String,
      twitter_app_secret: Types::String,
      twitter_access_token_secret: Types::String,
      google_private_key: Types::String,
      smtp_settings_password: Types::String
    ) do |object, _params|
      object.secrets.transform_values do |_value|
        "(redacted)"
      end
    end

  end
end
