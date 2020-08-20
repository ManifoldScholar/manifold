# Be sure to restart your server when you modify this file.

# Add new inflection rules using the following format. Inflections
# are locale specific, and you may define rules for as many different
# locales as you wish. All of these examples are active by default:
# ActiveSupport::Inflector.inflections(:en) do |inflect|
#   inflect.plural /^(ox)$/i, '\1en'
#   inflect.singular /^(ox)en/i, '\1'
#   inflect.irregular 'person', 'people'
#   inflect.uncountable %w( fish sheep )
# end

# These inflection rules are supported but not enabled by default:
# ActiveSupport::Inflector.inflections(:en) do |inflect|
#   inflect.acronym 'RESTful'
# end
ActiveSupport::Inflector.inflections do |inflect|
  inflect.uncountable %w(me)
  inflect.acronym "SFTP"
  inflect.acronym "SSH"
  inflect.acronym "TOC"
  inflect.acronym "CSV"
  inflect.acronym "DSL"
  inflect.acronym "XHTML"
  inflect.acronym "HTML"
  inflect.acronym "HTTP"
  inflect.acronym "API"
  inflect.acronym "JSON"
end

Rails.autoloaders.each do |autoloader|
  autoloader.inflector.inflect(
    "url" => "URL",
    "get_reader_url" => "GetReaderURL",
    "client_url" => "ClientURL",
    "persistent_ui" => "PersistentUI"
  )
end
