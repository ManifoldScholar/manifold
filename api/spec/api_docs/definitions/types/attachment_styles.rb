module ApiDocs
  module Definition
    module Types
      class AttachmentStyles < Types::Object

        def properties?
          true
        end

        def properties
          {
            small: Type.url,
            smallSquare: Type.url,
            smallLandscape: Type.url,
            smallPortrait: Type.url,
            medium: Type.url,
            mediumSquare: Type.url,
            mediumLandscape: Type.url,
            mediumPortrait: Type.url,
            largeLandscape: Type.url,
            original: Type.url
          }
        end

      end
    end
  end
end
