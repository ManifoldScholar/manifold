# Includes pagination links and meta for an included collection
# rubocop:disable Naming/PredicateName
module HasManyPaginated
  extend ActiveSupport::Concern

  class_methods do
    def has_many_paginated(association_name, **options)
      __send__(:has_many, association_name, options) do |serializer|
        paginated = if block_given?
                      yield serializer
                    else
                      serializer.object.__send__ association_name
                    end
        paginated = serializer.paginate_scope paginated, association_name

        links = serializer.has_many_links association_name, paginated
        links.each { |key, value| link key, value }

        meta serializer.has_many_pagination paginated
        paginated
      end
    end
  end

  # rubocop:disable Metrics/LineLength, Metrics/AbcSize
  def has_many_links(association_name, paginated)
    route = "api_v1_#{object.class.name.underscore}_relationships_#{association_name}_path"
    return {} unless Rails.application.routes.url_helpers.method_defined? route
    per_page = paginated.limit_value

    {}.tap do |hash|
      hash[:first] = get_url_for(route, object, page: 1, per_page: per_page)
      hash[:last] = get_url_for(route, object, page: paginated.total_pages, per_page: per_page)
      hash[:next] = get_url_for(route, object, page: paginated.next_page, per_page: per_page) if paginated.next_page
      hash[:prev] = get_url_for(route, object, page: paginated.prev_page, per_page: per_page) if paginated.prev_page
    end
  end
  # rubocop:enable Metrics/LineLength, Metrics/AbcSize

  def get_url_for(route, object, **page_params)
    __send__ route,
             object.id,
             page_params
  end

  def paginate_scope(scope, association_name)
    page, per = page_params association_name
    scope.page(page).per(per)
  end

  def has_many_pagination(paginated)
    { pagination: pagination_dict(paginated).merge(per_page: paginated.limit_value.to_i) }
  end

  def page_params(association_name)
    per = pagination.dig(association_name, :size)
    page = pagination.dig(association_name, :number) || 1
    [page, per]
  end

  def pagination
    instance_options[:pagination] || {}
  end

  def pagination_dict(object)
    {
      current_page: object.current_page.to_i,
      next_page: object.next_page.to_i,
      prev_page: object.prev_page.to_i,
      total_pages: object.total_pages.to_i,
      total_count: object.total_count.to_i
    }
  end
end
# rubocop:enable Naming/PredicateName
