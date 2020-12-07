class CreateAnalyticsVisitsAndEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :analytics_visits, id: :uuid do |t|
      t.string :visit_token, null: false
      t.string :visitor_token, null: false

      # the rest are recommended but optional
      # simply remove any you don't want

      # standard
      t.string :ip
      t.text :user_agent
      t.text :referrer
      t.string :referring_domain
      t.text :landing_page

      # technology
      t.string :browser
      t.string :os
      t.string :device_type

      # location
      t.string :country
      t.string :region
      t.string :city
      t.float :latitude
      t.float :longitude

      # utm parameters
      t.string :utm_source
      t.string :utm_medium
      t.string :utm_term
      t.string :utm_content
      t.string :utm_campaign

      # native apps
      t.string :app_version
      t.string :os_version
      t.string :platform

      t.timestamp :started_at
      t.timestamp :ended_at
    end

    add_index :analytics_visits, [:visit_token], unique: true

    create_table :analytics_events, id: :uuid do |t|
      t.references :visit, type: :uuid, index: true, null: false

      t.string :name, null: false
      t.jsonb :properties, default: {}, null: false
      t.timestamp :time, null: false
    end

    add_index :analytics_events, [:name, :time]
    add_index :analytics_events, :properties, using: :gin, opclass: :jsonb_path_ops
  end
end
