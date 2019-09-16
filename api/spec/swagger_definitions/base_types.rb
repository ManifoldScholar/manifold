# base Type used by all swagger json definitions
require 'rails_helper'

module Type

  # A helper function to handle merging params while making a special case for nullable attributes.
  # Rswag currently generates OpenAPI v2 documentation, and the method for declaring nullable
  # values changes in OpenAPI v3. To make the change easier whenever it happens, this helper function
  # will make it so passing a { nullable: true } value into any of these base Types will set the
  # nullable swagger definition properly
  def self.merge_params_with_nullable(base, params = {})
    nullable = params.delete(:nullable)
    base = base.merge({'x-nullable': true }) if nullable
    base = base.merge(params)
    return base
  end

  ######################
  # general data types #
  ######################

  def self.boolean(params = {})
    self.merge_params_with_nullable({ type: :boolean }, params)
  end

  def self.number(params = {})
    self.merge_params_with_nullable({ type: :integer }, params)
  end

  def self.id(params = {})
    self.merge_params_with_nullable({ type: :string }, params)
  end

  def self.integer(params = {})
    self.merge_params_with_nullable({ type: :number }, params)
  end

  def self.url(params = {})
    self.merge_params_with_nullable({ type: :string, example: 'http://url.com' }, params)
  end

  def self.nullable_string(params = {})
    { type: :string, 'x-nullable': true }.merge(params)
  end

  def self.object(contents)
    { type: :object, properties: contents }
  end

  def self.object(contents, params = {})
    { type: :object, properties: contents }.merge(params)
  end

  def self.reference(path)
    { '$ref': path }
  end

  # 'type' is a required param for the array
  def self.array(params = {})
    items = params.delete(:type)
    base = { type: :array }
    base = base.merge({ items: items })
    base = base.merge(params)
    return base
  end

  def self.enum(array)
    {
      type: :string,
      enum: array
    }
  end

  def self.enum(array, params = {})
    {
      type: :string,
      enum: array
    }.merge(params)
  end

  def self.string(params = {})
    self.merge_params_with_nullable({ type: :string }, params)
  end

  def self.email(params = {})
    self.merge_params_with_nullable({ type: :string, example: 'address@email.com' }, params)
  end

  def self.date_time(params = {})
    self.merge_params_with_nullable({ type: :string, format: "date-time" }, params)
  end


  def self.currency_code()
    { example: "USD", description: "International currency codes (see http://www2.1010data.com/documentationcenter/discover/FunctionReference/DataTypesAndFormats/currencyUnitCodes.html)"}
  end

  ####################################
  # frequently used data structures  #
  ####################################

  def self.request(contents)
    self.object({
      data: self.object({
        attributes: contents
      })
    })
  end

  def self.crud(params = {})
    {
      create: self.boolean,
      read: self.boolean,
      update: self.boolean,
      delete: self.boolean
    }
  end

  def self.permissions
    self.object({
      readDrafts: self.boolean,
      readLog: self.boolean,
      manageResources: self.boolean,
      createResources: self.boolean,
      manageResourceCollections: self.boolean,
      createResourceCollections: self.boolean,
      managePermissions: self.boolean,
      createPermissions: self.boolean,
      manageTexts: self.boolean,
      createTexts: self.boolean,
      manageTwitterQueries: self.boolean,
      createTwitterQueries: self.boolean,
      manageEvents: self.boolean,
      manageSocials: self.boolean,
      updateMakers: self.boolean,
      create: self.boolean,
      read: self.boolean,
      update: self.boolean,
      delete: self.boolean
    })
  end

  def self.image
    self.reference( '#/definitions/Image' )
  end

  def self.attachment
    self.reference( '#/definitions/Attachment' )
  end

  def self.data_array(dataType)
    self.object({
      data: self.array( type: dataType )
    })
  end

  def self.paginated(dataType)
    self.object({
      data: self.array( type: dataType ),
      links: self.object({
        self: self.url( nullable: true ),
        first: self.url( nullable: true ),
        prev: self.url( nullable: true ),
        next: self.url( nullable: true ),
        last: self.url( nullable: true )
      }),
      meta: self.object({
        pagination: self.object({
          perPage: self.number,
          currentPage: self.number,
          nextPage: self.number,
          prevPage: self.number,
          totalPages: self.number,
          totalCount: self.number
        })
      })
    })
  end

  def self.meta_partial()
    self.object({
      partial: self.boolean
    })
  end

  def self.relationship_data
    self.reference( '#/definitions/RelationshipData' )
  end

  def self.relationships(array)
    base = {}
    array.each do |item|
      base = base.merge({ "#{item}" => self.relationship_data })
    end
    return base
  end

  # TODO refactor this out in favor of the response and
  # response_with_relationships methods
  def self.data_response_hash(attributes)
    {
      id: self.id,
      type: self.string,
      attributes: attributes,
      meta: self.meta_partial
    }
  end

  def self.response(attributes)
    self.object({
      id: self.id,
      type: self.string,
      attributes: self.object( attributes ),
      meta: self.meta_partial
    })
  end

  def self.response_with_relationships(attributes, relationships)
    self.object({
      id: self.id,
      type: self.string,
      attributes: self.object( attributes ),
      meta: self.meta_partial,
      relationships: self.object( relationships )
    })
  end

  ###########################################
  ## Attributes located across the project ##
  ###########################################

  def self.slug() { description: I18n.t('attributes.descriptions.slug') } end
  def self.pending_slug() { description: I18n.t('attributes.descriptions.pending_slug') } end
  def self.standalone_mode() { enum: ['enabled', 'disabled', 'enforced'] } end
  def self.avatar_color()
    {
      enum: [
        "primary",
        "secondary",
        "tertiary",
        "quaternary",
        "quinary",
        "sentary"
      ]
    }
  end

  def self.currency_code()
    { example: "USD", description: "International currency codes (see http://www2.1010data.com/documentationcenter/discover/FunctionReference/DataTypesAndFormats/currencyUnitCodes.html)"}
  end

  ############################
  ## Helper data structures ##
  ############################

  def self.relationship_data_attribute
    self.object({
      data: self.object({
        id: self.id,
        type: self.string
      })
    })
  end

  def self.relationship_data_attributes
    self.object({
      data: self.array(
        type: self.object({
          id: self.id,
          type: self.string
        })
      )
    })
  end

  def self.attachment_attributes
    Type.object({
      data: self.string,
      filename: self.string,
      content_type: self.string,
    })
  end

  def self.image_attributes
    self.object({
      small: self.url( nullable: true ),
      smallSquare: self.url( nullable: true ),
      smallLandscape: self.url( nullable: true ),
      smallPortrait: self.url( nullable: true ),
      medium: self.url( nullable: true ),
      mediumSquare: self.url( nullable: true ),
      mediumLandscape: self.url( nullable: true ),
      mediumPortrait: self.url( nullable: true ),
      largeLandscape: self.url( nullable: true ),
      original: self.url( nullable: true )
    })
  end
end
