module V1
  class SettingSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    set_id :singleton_guard

    camelized_attributes :general,
                         :theme,
                         :integrations,
                         :email,
                         :press_logo_styles,
                         :press_logo_footer_styles,
                         :press_logo_mobile_styles,
                         :favicon_styles

    attributes :copyright_formatted

    attributes :calculated do |object, params|
      camelize_hash(object.calculated(params[:current_user]))
    end

    attributes :oauth do |_object, _params|
      camelize_hash(ManifoldEnv.oauth.as_json)
    end

    attributes :secrets do |object, _params|
      camelize_hash(
        object.secrets.transform_values do |_value|
          "(redacted)"
        end
      )
    end

  end
end
