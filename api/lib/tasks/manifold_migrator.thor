require_relative "../../config/environment"

class ManifoldMigrator < Thor
  ENV_FILE_OPTIONS = [
    "~/environment/01_unmanaged.env",
    Rails.root.join(".env").to_s
  ]

  desc "migrate_uploads", "Dewit"
  def migrate_uploads
    MirrorUploads.dewit
  end

  desc "setup", "Set up this Manifold instance for asset migration"
  def setup
    say cool_manifold_logo, :green

    say <<~TEXT, :magenta, true
      Hello! Welcome to the Manifold Migrator CLI Tool!

    TEXT

    sleep 3

    say <<~TEXT, :magenta
      This tool will help you prepare to migrate your Manifold instance from a bare-metal installation (i.e. .deb package)
      to a modern Dockerized deployment.

    TEXT

    say process_outline

    sleep 3

    @domain = ask("But first, what will be the host name of your new Manifold instance? (Default: #{ENV["DOMAIN"]})").presence || ENV["DOMAIN"]

    say "Step #1: Clone uploads to a cloud service", :bold
    say "-----------------------------------------\n\n"

    sleep 2

    @storage = Storage::Factory

    if @storage.primary_store_file?
      say <<~TEXT, :bold
        Your Manifold instance is currently using local file storage. This is not supported in a Dockerized hosting environment.

      TEXT

      setup_s3
    elsif @storage.primary_store_cloud?
      setup_s3 if no? <<~TEXT, :bold
        Looks like you're already using a cloud-hosted bucket for uploads. Great! Would you like to continue using this service
        for your new Manifold instance? (y/n)
      TEXT
    end

    say "Step #2: Environment Variables", :bold
    say "------------------------------\n\n"

    say <<~TEXT
      Copy the following environment variables into your new hosting provider.

    TEXT

    say <<~TEXT, :yellow
      NOTE: This list may not be complete! Check your environment and configuration carefully.

    TEXT

    say transition_env_vars

  rescue Interrupt
    say "Ok I love you bye bye!", :red
    exit 1
  end

  private

  def continue?(message = "Do you want to continue? (y/n)", color = :bold, on_exit = "Exiting. Hope to see you soon!", on_exit_color = :red)
    if no? message, color
      say(on_exit, on_exit_color)
      exit 0
    else
      say "\n"
    end
  end

  def setup_s3
    say <<~TEXT
      The first step in this migration is to ensure all uploaded assets are moved to a S3-compatible storage bucket. To do that,
      we'll set up an upload mirror to copy uploads to an S3-compatible service.

      In order to continue, you need to have a bucket set up in S3 or a S3-compatible system such as Digital Ocean Spaces.
      You also need credentials handy for a user that has read/write access to the bucket.

    TEXT

    say "NOTE: This tool does not support setting up GCS buckets. If you'd like to use GCS, please set it up manually.\n", :yellow

    if @storage.mirror_store.present?
      if @storage.mirror_store_file?
        say <<~TEXT, :red
          It looks like you already have an upload mirror defined, but it refers to a local file store. In order to continue,
          we'll need to detach this mirror and replace it with an S3-compatible cloud storage service.

        TEXT

        continue?
      else
        say <<~TEXT, :red
          It looks like you already have an upload mirror defined, and it points to a cloud service.

        TEXT

        if no? <<~TEXT, :bold
          Would you like to use this mirror as the primary store for your new Manifold instance? (y/n)
        TEXT
          continue? "Ok, we can set up a new one, but it will detach your current mirror. Would you like to continue? (y/n)"
        else
          return
        end
      end
    end

    collect_s3_mirror_info

    say <<~TEXT
      Okay, we're setting things up to start mirroring uploads to your bucket. Hold on...

    TEXT

    setup_s3_mirror_env

    maybe_restart_and_enqueue_mirror_job
  end

  def maybe_restart_and_enqueue_mirror_job
    say <<~TEXT, :yellow
      We are now ready to start mirroring uploads. But first, we need to restart the Manifold API.

      Once this happens, all existing uploaded files will start to be copied to the mirror in a background thread.
      One thread at a time will be used for this job. Manifold will continue to function, but background jobs may be slower to complete.
    TEXT

    return if no? "Do you want to restart Manifold and start uploading now? Manifold will be briefly unavailable while it restarts. (y/n)", :bold

    say "Startin' the jerb"

    UploadMigrationJob.perform_later

    say "Restarting..."

    puts `sudo service restart manifold_api`
  end

  def collect_s3_mirror_info
    say "Okay, let's collect that data from you."

    @bucket_name = ask("What's the name of the bucket you'll be migrating to?")
    @region = ask("What's the region?")
    @access_key_id = ask("What's the Access Key Id?")
    @secret_access_key = ask("What's the Secret Access Key?")
    @endpoint = ask("If you're using a service other than Amazon S3 (i.e. Digital Ocean Spaces), what's the endpoint URL?").presence
    @force_path_style = yes?("Force path style URLs? (y/n)", :bold)

    say <<~TEXT

      Bucket Name: #{@bucket_name}
      Region: #{@region}
      Access Key ID: #{@access_key_id}
      Secret Access Key: #{@secret_access_key}
      Endpoint: #{@endpoint || "default"}
      Force Path Style: #{@force_path_style.to_s}

    TEXT

    collect_s3_info if no? "Does this look correct? (y/n)", :bold
  end

  def setup_s3_mirror_env
    say_status "Processing", "Looking up environment file...", :yellow
    env_file_location = ENV_FILE_OPTIONS.find { |fp| File.exist? fp }

    fatal!("Cannot find environment file") if env_file_location.blank?

    env_file = File.open(env_file_location, "w")

    say_status "Success", "Found environment file at #{env_file.path}."

    say_status "Processing", "Writing upload mirror variables...", :yellow

    env_file.write(s3_env_vars)

    say_status "Success", "Environment updated"
  end

  def s3_env_vars
    <<~TEXT

      MANIFOLD_SETTINGS_STORAGE_MIRROR='s3'
      MANIFOLD_SETTINGS_STORAGE_MIRROR_BUCKET='#{@bucket_name}'
      MANIFOLD_SETTINGS_STORAGE_MIRROR_PREFIX='#{@storage.primary_prefix}'
      S3_ACCESS_KEY_ID='#{@access_key_id}'
      S3_SECRET_ACCESS_KEY='#{@secret_access_key}'
      S3_REGION='#{@region}'
      S3_FORCE_PATH_STYLE='#{@force_path_style.to_s.upcase}'
      #{@endpoint && "S3_ENDPOINT='#{@endpoint}'"}
    TEXT
  end

  def fatal!(message)
    say_error "#{message}\n", :on_red
    say_error "The above error is fatal. Exiting.", :red
    exit 1
  end

  # Overrides

  # Default bold for asks
  def ask(message, color = :bold)
    super
  end

  # Content methods

  def transition_env_vars
    <<~TEXT
      DOMAIN='#{@domain}'
      MANIFOLD_SETTINGS_STORAGE_PRIMARY='s3'
      MANIFOLD_SETTINGS_STORAGE_PRIMARY_BUCKET='#{@bucket_name}'
      MANIFOLD_SETTINGS_STORAGE_CACHE_BUCKET='#{@storage.cache_bucket}'
      MANIFOLD_SETTINGS_STORAGE_TUS_BUCKET='#{@storage.tus_bucket}'
      MANIFOLD_SETTINGS_STORAGE_PRIMARY_PREFIX='#{@storage.primary_prefix}'
      MANIFOLD_SETTINGS_STORAGE_CACHE_PREFIX='#{@storage.cache_prefix}'
      MANIFOLD_SETTINGS_STORAGE_TUS_PREFIX='#{@storage.tus_prefix}'
      S3_ACCESS_KEY_ID='#{@access_key_id}'
      S3_SECRET_ACCESS_KEY='#{@secret_access_key}'
      S3_REGION='#{@region}'
      S3_FORCE_PATH_STYLE='#{@force_path_style.to_s.upcase}'
      #{@endpoint && "S3_ENDPOINT='#{@endpoint}'"}
    TEXT
  end

  def process_outline
    <<~TEXT
      In order to seamless move from a bare metal installation to a Dockerized install, we need to do a few things:

      SETUP PHASE:
      1) Clone all uploaded assets to a S3-compatible storage bucket (unless they're already in one)
      2) Extract relevant configuration / environment variables
      3) Set up your new Dockerized hosting environment

      Then, when you're ready to make it happen:

      MIGRATION PHASE:
      4) Put this Manifold instance into maintenance/read-only mode
      5) Clone the database to your new hosting environment
      6) Change DNS records to point to the new host

      This tool can help with each step *except* #6.

    TEXT
  end

  def cool_manifold_logo
    <<-LOGO
                     Manifold Scholarship

  ╦
  ░░░╬φ╦,                                               ,╓╤
  ░░░╬░░░░░╬╦╦,                                  ,╓╦φ╣╬░░░░
  ░░░    "╚╬░░░░╬▒╦╦,                     ,╓╦φ╬╬░░░░░╬╩╙"
  ░░░         `╙╩╬░░░░╬φ╦╖         ,╓╦φ╣╬░░░░░╬╩╙"
  ░░░               "╙╩░░░░░╬╦╦φ╣╬░░░░░╬╩╙"            ,╔╦φ
  ░░░                ,╓╦╬░░░░░░░░░░░░,          ,╓╦φ╬╬░░░░░
  ░░░         ,╓╦φ▒╬░░░░░╬╩╨╠░░░╙╩╬░░░░╬▒╦╦╦φ╬╬░░░░░╩╩╙`
  ░░░   ,╦φ╣╬░░░░░╬╩╨"      ]░░░     "╙╩░░░░░░░░░
  ░░░╬░░░░░░╩╨"            ,╠░░░           "╚╬░░░░░╬╦╦,╔╦ê╬
  ░░╬╩╩"            ,╓╦φ╣╬░░░░░░                `╙╩╬░░░░░░░
             ,╓╦φ╣╬░░░░░╬╩╙"╠░░░                      `║░░░
      ,╓╦φ╣╬░░░░░╬╩╙"       ]░░░                       ║░░░
  φ╣╬░░░░░╬╩╨"            ,╔╣░░░                       ║░░░
  ░╬╩╙`            ,╓╦φ╬╬░░░░░░░                       ║░░░
            ,╓╦φ╬╬░░░░░╩╩╙` ╠░░░                       ║░░░
     ,╓╦φ╣╬░░░░░╩╩"`        ]░░░                       ║░░░
  ╣╬░░░░░╩╩"`            ,╔╦╣░░░                       ║░░░
  ╬╩╙`            ,╔╦φ╬░░░░░░░░░                       ║░░░
           ,╔╦φ╬╬░░░░░╩╩"   ]░░░                       ║░░░
    ,╔╦φ╣░░░░░░╩╩"`         ]░░░                       ║░░░
  ░░░░░░╩╩"`            ,╦╦╣╬░░░╣╦╦,                   ║░░░
  ╩"`            ,╦╦╣╬░░░░░╬╩╩╙╩╬░░░░╬▒╦╖              ║░░░
         ,,╦╦▒╬░░░░░╬╩╙"           `╙╩╬░░░░╬φ╦╓        ║░░░
   ,╦╦ê╣░░░░░░╩╨"                        "╚╬░░░░░╣╦╦,  ║░░░
  ░░░░░╩╩"                                    `╙╩╬░░░░╬╬░░░
  "                                                 `╙╩╬░░░
                                                          "
    LOGO
  end

end



# This is a long-running job that manages the entire asset migration process
# It will enqueue individual uploads at a pace set by {delay}
# By default, delay is set to process reasonably slow in order to avoid overwhelming the worker
class MirrorUploads
  def self.dewit(attachables = nil)
    @attachables = attachables || default_attachables

    @attachables.each do |model|
      attachments = model.shrine_attachment_configurations.keys

      puts "Mirroring attachments for model #{model.to_s}"

      model.find_each do |record|
        attachments.each do |attachment_name|
          attacher = record.send("#{attachment_name}_attacher")
          next unless attacher.stored?

          puts "Putting #{model.to_s} #{record.id} #{attachment_name}"
          attacher.file.trigger_mirror_upload

          attacher.map_derivative(attacher.derivatives) do |_, derivative|
            derivative.trigger_mirror_upload
          end
        end
      end
    end

  end

  def self.default_attachables
    ApplicationRecord.descendants.select { |model| model.include? Attachments }
  end

end

MirrorUploads.dewit
