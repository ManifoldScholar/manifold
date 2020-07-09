if Rails.env.development?
  begin
    Rails.application.eager_load!
  rescue ActiveRecord::ActiveRecordError
    # purposely left blank
  end
end
