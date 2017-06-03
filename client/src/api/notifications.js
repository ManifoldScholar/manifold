import { possessivize } from 'utils/string';
import r from './requests';

export default {
  [r.beProjectDestroy]: (payload) => {
    return {
      level: 0,
      heading: "The project has been deleted.",
      body: `Alas, it has passed into the endless night.`,
      expiration: 5000
    };
  },
  [r.beUserUpdate]: (payload) => {
    return {
      level: 0,
      heading: "Success!",
      body: `${possessivize(payload.data.attributes.fullName)} account has been updated`,
      expiration: 5000
    };
  },
  [r.gPasswordReset]: (payload) => {
    return {
      level: 0,
      heading: "Success",
      body: "Your password has been reset."
    };
  },
  [r.beMakerUpdate]: (payload) => {
    return {
      level: 0,
      heading: "Success",
      body: `${payload.data.attributes.fullName} has been updated`,
    };
  },
  [r.beMakerCreate]: (payload) => {
    return {
      level: 0,
      heading: "New maker record created",
      body: `${possessivize(payload.data.attributes.fullName)} can now be added to 
              projects, texts, and users in the backend.`
    };
  },
  'editor-backend-settings': (payload) => {
    return {
      level: 0,
      id: 'SETTINGS_UPDATED',
      heading: "Manifold settings updated",
      body: "Your Manifold settings changes have been applied."
    };
  },
  'update-creators': (payload) => {
    return {
      level: 0,
      heading: "Project authors has been updated",
      expiration: 5000
    };
  },
  'create-creators': (payload) => {
    return {
      level: 0,
      heading: "New maker record created",
      body: `${possessivize(payload.data.attributes.fullName)} can now be added to 
             projects, texts, and users in the backend.`,
      expiration: 5000
    };
  },
  'update-contributors': (payload) => {
    return {
      level: 0,
      heading: "Project contributors have been updated",
      expiration: 5000
    };
  },
  'create-contributors': (payload) => {
    return {
      level: 0,
      heading: "New maker record created",
      body: `${possessivize(payload.data.attributes.fullName)} can now be added to 
             projects, texts, and users in the backend.`,
      expiration: 5000
    };
  },
  [r.beTextCategoryDestroy]: () => {
    return {
      level: 0,
      heading: "The category has been deleted.",
      body: `To sleep, perchance to dream - ay, there's the rub`,
      expiration: 5000
    };
  },
  [r.beMakerDestroy]: () => {
    return {
      level: 0,
      heading: "The maker has been deleted.",
      body: `Henceforth I quit thee from my thought, my part is ended on thy stage.`,
      expiration: 5000
    };
  },
  [r.beUserDestroy]: () => {
    return {
      level: 0,
      heading: "The user has been deleted.",
      body: `Henceforth I quit thee from my thought, my part is ended on thy stage.`,
      expiration: 5000
    };
  },
  "editor-backend-edit-user": (payload) => {
    return {
      level: 0,
      heading: "Success!",
      body: `${possessivize(payload.data.attributes.fullName)} account has been updated`,
      expiration: 5000
    };
  },
  "editor-backend-create-project": () => {
    return {
      level: 0,
      heading: "Your project has been created.",
      body: "A new manifold project is born.",
      expiration: 5000
    };
  },
  "editor-backend-project-update": (payload) => {
    return {
      level: 0,
      heading: "Success",
      body: `${payload.data.attributes.title} has been updated`,
    };
  },
  "editor-backend-category-update": (payload) => {
    return {
      level: 0,
      heading: "Success",
      body: `${payload.data.attributes.title} has been saved`,
    };
  },
  "editor-backend-resource-create": (payload) => {
    return {
      level: 0,
      heading: "Your resource has been created.",
      body: "A new manifold resource is born.",
    };
  },
  "editor-backend-maker-update": (payload) => {
    return {
      level: 0,
      heading: "Success",
      body: `${payload.data.attributes.fullName} has been updated`,
    };
  },
  "editor-backend-resource-update": (payload) => {
    return {
      level: 0,
      heading: "Success",
      body: `${payload.data.attributes.title} has been updated`,
    };
  },
  [r.beCollectionCreate]: (payload) => {
    return {
      level: 0,
      heading: "Your collection has been created.",
      body: "A new manifold collection is born.",
      expiration: 5000
    };
  },
  [r.beCollectionUpdate]: (payload) => {
    return {
      level: 0,
      heading: "Success",
      body: `${payload.data.attributes.title} has been updated`,
      expiration: 5000
    };
  }
};
