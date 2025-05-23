# frozen_string_literal: true

class ManifoldSearchConfig < ApplicationConfig
  config_name :manifold_search

  attr_config strategy: "pg"

  coerce_types strategy: :string

  def result_serializer
    if use_pg_search?
      ::V1::PgSearchSerializer
    else
      ::V1::SearchResultSerializer
    end
  end

  def use_pg_search?
    strategy == "pg"
  end
end
