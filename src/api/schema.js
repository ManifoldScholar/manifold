import { Schema, arrayOf } from 'normalizr';

// Entity schemas
export const textSchema = new Schema('texts');
export const textSectionSchema = new Schema('textSections');

// Collection schemas
export const textsSchema = arrayOf(textSchema);
export const textSectionsSchema = arrayOf(textSectionSchema);

// Define text schema
textSchema.define({
  attributes: {
    textSections: textSectionsSchema,
    tocSection: textSectionSchema
  }
});

