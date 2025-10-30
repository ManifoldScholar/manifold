# frozen_string_literal: true

Anyway::Loaders::YAML.permitted_classes << Symbol
Anyway::Loaders::YAML.permitted_classes << Regexp
Rails.application.config.anyway_config.future.use :unwrap_known_environments
