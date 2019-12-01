require "uber/inheritable_attr"

module V1
  class ManifoldSerializer

    extend Uber::InheritableAttr
    include FastJsonapi::ObjectSerializer

    set_key_transform :camel_lower
    inheritable_attr :partial_by_default
    self.partial_by_default = false

    def initialize(resource, options = {})
      process_options(options)
      @params[:root] = self.class unless @params.key? :root

      @resource = resource
    end

    class << self

      def authenticated?(params)
        params[:current_user].present?
      end

      def current_user_can_update?(object, params)
        return false unless params[:current_user]

        params[:current_user].can_update?(object)
      end

      def current_user_is_object_user?(object, params)
        return false unless params[:current_user]
        return false unless object.respond_to? :user

        object.user == params[:current_user]
      end

      def current_user_is_creator?(object, params)
        return false unless params[:current_user]
        return false unless object.respond_to? :creator

        object.creator == params[:current_user]
      end

      def metadata_properties(object)
        object.metadata_properties.map { |p| p.camelize(:lower) }
      end

      def abilities(object, params)
        camelize_hash(object.serialized_abilities_for(params[:current_user]))
      end

      def include_private_data?(object, params = {})
        return true if params[:include_private_data] == true
        return false unless authenticated?(params)

        object.updatable_by?(params[:current_user]) || current_user_is_creator?(object, params)
      end

      def private_attribute(attribute, &block)
        attribute attribute, if: proc { |object, params|
          include_private_data?(object, params)
        }, &block
      end

      def private_attributes(*attributes_list)
        attributes_list.each do |an_attribute|
          private_attribute(an_attribute)
        end
      end

      def make_partial_by_default
        self.partial_by_default = true
      end

      def manifold_meta
        meta_proc = proc { |resource, params|
          out = block_given? ? yield(resource, params) : {}
          if partial_by_default.blank?
            out[:partial] = false
            next out
          end

          out[:partial] = !full?(params)
          camelize_hash(out)
        }
        meta(&meta_proc)
      end

      def full_has_many(relationship_name, options = {})
        options[:if] = if_full_proc
        has_many relationship_name, options
      end

      def full_has_one(relationship_name, options = {})
        options[:if] = if_full_proc
        has_one relationship_name, options
      end

      def full_belongs_to(relationship_name, options = {})
        options[:if] = if_full_proc
        belongs_to relationship_name, options
      end

      def if_full_proc
        proc do |_resource, params|
          full?(params)
        end
      end

      def full?(params)
        return true unless partial_by_default

        params.dig(:full) == true && params.dig(:root) == self
      end

      def full_attributes(*attributes_list, &block)
        attributes_list.each do |an_attribute|
          attribute an_attribute, if: if_full_proc, &block
        end
      end

      def full_camelized_attributes(*attributes_list)
        attributes_list.each do |an_attribute|
          attribute an_attribute, if: if_full_proc do |object, _params|
            hash = object.send(an_attribute)
            next nil if hash.nil?
            raise "camelized attributes must responsd to deep_transform_keys" unless
              hash.respond_to? :deep_transform_keys

            camelize_hash(hash)
          end
        end
      end

      def camelized_attributes(*attributes_list)
        attributes_list.each do |an_attribute|
          attribute an_attribute do |object, _params|
            hash = object.send(an_attribute)
            next nil if hash.nil?
            raise "camelized attributes must responsd to deep_transform_keys" unless
              hash.respond_to? :deep_transform_keys

            camelize_hash(hash)
          end
        end
      end

      def camelize_hash(hash)
        hash.deep_transform_keys { |key| key.to_s.camelize(:lower) }.symbolize_keys!
      end

      # rubocop:disable Naming/PredicateName
      def has_many(relationship_name, options = {}, &block)
        options[:pluralize_type] = true
        super(relationship_name, options, &block)
      end
      # rubocop:enable Naming/PredicateName

      # rubocop:disable Naming/PredicateName, Metrics/AbcSize,
      def has_many_paginated(relationship_name, options = {})
        meta = {}
        options[:meta] = proc { |_object, _params|
          { pagination: meta }
        }
        has_many(relationship_name, options) do |object, params|
          page, per = page_params(relationship_name, params)
          scope = block_given? ? yield(object, params) : object.send(relationship_name)
          paginated = scope.page(page).per(per)
          meta[:currentPage] = paginated.current_page.to_i
          meta[:nextPage] = paginated.next_page.to_i
          meta[:prevPage] = paginated.prev_page.to_i
          meta[:totalPages] = paginated.total_pages.to_i
          meta[:totalCount] = paginated.total_count.to_i
          paginated
        end
      end
      # rubocop:enable Naming/PredicateName, Metrics/AbcSize

      # rubocop:disable Naming/PredicateName
      def has_one(relationship_name, options = {}, &block)
        options[:pluralize_type] = true
        super(relationship_name, options, &block)
      end
      # rubocop:enable Naming/PredicateName

      def belongs_to(relationship_name, options = {}, &block)
        options[:pluralize_type] = true
        super(relationship_name, options, &block)
      end

      def page_params(relationship_name, params)
        return nil unless params[:pagination].present?

        pagination = params[:pagination]

        per = pagination.dig(relationship_name, :size)
        page = pagination.dig(relationship_name, :number) || 1
        [page, per]
      end

    end

  end
end
