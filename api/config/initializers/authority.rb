# frozen_string_literal: true

Authority.configure do |config|
  # USER_METHOD
  # ===========
  # Authority needs the name of a method, available in any controller, which
  # will return the currently logged-in user. (If this varies by controller,
  # just create a common alias.)
  #
  # Default is:
  #
  config.user_method = :authority_user

  # CONTROLLER_ACTION_MAP
  # =====================
  # For a given controller method, what verb must a user be able to do?
  # For example, a user can access 'show' if they 'can_read' the resource.
  #
  # These can be modified on a per-controller basis; see README. This option
  # applies to all controllers.
  #
  # Defaults are as follows:
  #
  config.controller_action_map = {
    index: "read",
    show: "read",
    new: "create",
    create: "create",
    edit: "update",
    update: "update",
    destroy: "delete",
    resolve_flags: "resolve_flags",
    lookup: "lookup"
  }

  # ABILITIES
  # =========
  # Teach Authority how to understand the verbs and adjectives in your system. Perhaps you
  # need {:microwave => 'microwavable'}. I'm not saying you do, of course. Stop looking at
  # me like that.
  #
  # Defaults are as follows:

  config.abilities = {
    create: "creatable",
    read: "readable",
    update: "updatable",
    delete: "deletable",
    read_deleted: "deleted_readable",
    read_drafts: "drafts_readable",
    fully_read: "fully_readable",
    list: "listable",
    bulk_delete: "bulk_deletable",
    resolve_flags: "flags_resolvable",
    manage: "manageable",
    manage_properties: "properties_manageable",
    create_properties: "properties_creatable",
    manage_project_exportations: "project_exportations_manageable",
    create_project_exportations: "project_exportations_creatable",
    manage_resources: "resources_manageable",
    create_resources: "resources_creatable",
    manage_resource_collections: "resource_collections_manageable",
    create_resource_collections: "resource_collections_creatable",
    update_makers: "makers_updatable",
    manage_entitlements: "entitlements_manageable",
    create_entitlements: "entitlements_creatable",
    manage_permissions: "permissions_manageable",
    create_permissions: "permissions_creatable",
    manage_texts: "texts_manageable",
    create_texts: "texts_creatable",
    manage_twitter_queries: "twitter_queries_manageable",
    create_twitter_queries: "twitter_queries_creatable",
    manage_events: "events_manageable",
    create_events: "events_creatable",
    manage_socials: "socials_manageable",
    read_secrets: "secrets_readable",
    read_log: "log_readable",
    notate: "notatable",
    engage_publicly: "publicly_engageable"
  }

  # LOGGER
  # ======
  # If a user tries to perform an unauthorized action, where should we log that fact?
  # Provide a logger object which responds to `.warn(message)`, unless your
  # security_violation_handler calls a different method.
  #
  # Default is:
  #
  # config.logger = Logger.new(STDERR)
  #
  # Some possible settings:
  config.logger = Rails.logger
  # config.logger = Logger.new('log/authority.log')  # Use this file
  # config.logger = Logger.new('/dev/null')          # Don't log at all (on a Unix system)
end
