export default {
  errors: {
    // These pointers should _really_ be scoped to resource type. However, ASM's
    // current implementation of json-api error objects doesn't allow us to include
    // the resource type in the response. We could pass the type down on the client
    // side, but that adds other kinds of complexity that we'd rather avoid. For now,
    // these pointer overrides will have to be unscoped. When this becomes a problem
    // in the future, perhaps ASM will have improved around this.
    pointers: {
      "/data/attributes/purpose": "A purpose"
    }
  },
  notifications: {
    projectAuthorizationWarning: {
      heading: "Only authorized users may access this project.",
      body:
        "Only users granted permission may view this project's texts, resources, and other content."
    },
    projectAuthorizationNotice: {
      heading: "Access to this project is restricted.",
      body:
        "Only users granted permission may view this project's texts, resources, and other content."
    }
  },
  event_types: {
    project_created: "Project Created",
    text_added: "Text Added",
    text_annotated: "Text Annotated",
    resource_added: "Resource Added",
    comment_created: "Comment Created",
    tweet: "Tweet"
  },
  roles: {
    admin: "Admin",
    editor: "Editor",
    project_creator: "Project Creator",
    marketeer: "Marketeer",
    reader: "Reader"
  },
  dialogs: {
    notation: {
      destroy: {
        heading: "Are you sure you want to remove this notation?",
        message:
          "Pressing yes will remove the notation from this spot in the text. " +
          "It will not remove it from the project."
      }
    },
    readingGroupMembership: {
      destroy: {
        heading: "Are you sure you want to remove this user from the group?",
        message:
          "Pressing yes will remove the user from this group. The user's annotations will remain in the group."
      },
      leave: {
        heading: "Are you sure you want to leave this reading group?",
        message:
          "Pressing yes will remove you from this group. Your annotations will remain in the group until you edit and save them."
      },
      warn: {
        roleChange: {
          heading: "Confirm Role Change.",
          memberToModerator:
            "Moderators can manage members and change group settings. Are you sure you want to do this?",
          moderatorToMember:
            "After this change, the user will no longer be able to manage members and group settings. Are you sure you want to do this?"
        }
      }
    },
    readingGroup: {
      warn: {
        privacyChange: {
          heading: "Confirm Privacy Change.",
          privateToPublic:
            "Changing this group from private to public will immediately make all annotations in the group visible to all readers. Are you sure you want to do this?",
          anonymousToPublic:
            "Changing this group from anonymous to public will immediately make all annotations in the group visible to all readers, and will reveal annotation authors. Are you sure you want to do this?",
          anonymousToPrivate:
            "Changing this group from anonymous to private will reveal the identity of annotation authors. Are you sure you want to do this?"
        }
      },
      join: {
        heading: "Please Confirm",
        message: `You are about to join the “<%= readingGroup.attributes.name %>” reading group. Click yes to confirm.`
      },
      joinNotFound: {
        heading: "Reading group not found",
        message:
          "No reading groups match the code you entered. Please double check it and try again"
      },
      joinFailure: {
        heading: "Join Failed",
        message:
          "Manifold couldn't add you to the reading group. Check and make sure you do not already belong to the group."
      },
      destroy: {
        heading: "Are you sure you want to delete this reading group?",
        message:
          "If the reading group is anonymous or private, all annotations within the group will be made private and only visible to the annotation creator. If the group is public, annotations will be public. This action can not be undone."
      },
      archive: {
        heading: "Are you sure you want to archive this group?",
        message:
          "This group’s annotations will be hidden for you in the reader. Groups can be reactivated at any time."
      }
    }
  },
  notificationPreferences: {
    digest: [
      {
        key: "digestCommentsAndAnnotations",
        label: "Include New Comments and Annotations?"
      }
    ],
    notifications: [
      {
        key: "repliesToMe",
        label: "Notify you when someone replies to you?",
        instructions:
          "Manifold will send you an email when a reply is posted to your annotations or comments."
      },
      {
        key: "projectCommentsAndAnnotations",
        label: "Notify you of all Comments and Annotations?",
        instructions:
          "Manifold will send you an email anytime a comment or annotation is created"
      },
      {
        key: "flaggedResources",
        label: "Notify me when comments are flagged.",
        instructions:
          "Anytime a user flags a comment, you will receive email notification."
      }
    ]
  },
  metadata: {
    seriesTitle: {
      placeholder: "Title of the series holding the item",
      instructions: "e.g. the series title for a book",
      type: "TextInput"
    },
    containerTitle: {
      placeholder: "Title of the container holding the item",
      instructions:
        "e.g. the book title for a book chapter, the journal title for a journal article",
      type: "TextInput"
    },
    isbn: {
      placeholder: "International Standard Book Number",
      type: "TextInput"
    },
    issn: {
      placeholder: "International Standard Serial Number",
      type: "TextInput"
    },
    originalPublisher: {
      placeholder:
        "Original publisher, for items that have been republished by a different publisher",
      type: "TextInput"
    },
    originalPublisherPlace: {
      placeholder: "Geographic location of the original publisher",
      type: "TextInput"
    },
    originalTitle: {
      placeholder: "Title of the original version",
      type: "TextInput"
    },
    publisher: {
      placeholder: "The Publisher",
      type: "TextInput"
    },
    publisherPlace: {
      placeholder: "Geographic location of the publisher",
      instructions: 'e.g "Minneapolis, MN"',
      type: "TextInput"
    },
    status: {
      placeholder: "Publication status of the item",
      instructions: 'e.g "forthcoming"',
      type: "TextInput"
    },
    version: {
      placeholder: "Version of the item",
      type: "TextInput"
    },
    seriesNumber: {
      placeholder: "Number identifying the series holding the item",
      instructions: "e.g. the series number for a book",
      type: "TextInput"
    },
    edition: {
      placeholder: "(Container) edition holding the item",
      instructions:
        'e.g. "3" when citing a chapter in the third edition of a book',
      type: "TextInput"
    },
    issue: {
      placeholder: "(Container) issue holding the item",
      instructions:
        'e.g. "5" when citing a journal article from journal volume 2, issue 5',
      type: "TextInput"
    },
    volume: {
      placeholder: "(Container) volume holding the item ",
      instructions: "e.g. “2” when citing a chapter from book volume 2",
      type: "TextInput"
    },
    rightsTerritory: {
      placeholder: "Geographic scope of relevance ",
      instructions: 'e.g. "US" for a US patent',
      type: "TextInput"
    },
    rights: {
      placeholder: "Copyright or licensing details",
      type: "TextArea"
    },
    restrictions: {
      placeholder: "Copyright or licensing restrictions",
      type: "TextInput"
    },
    rightsHolder: {
      placeholder: "Copyright or license holder",
      type: "TextInput"
    },
    uniqueIdentifier: {
      placeholder: "Enter an internal unique identifier",
      type: "TextInput"
    },
    doi: {
      placeholder: "Enter a digital object identifier",
      type: "TextInput"
    },
    resourcesDoi: {
      placeholder: "Enter a digital object identifier",
      type: "MaskedTextInput",
      inputProps: {
        mask: "doi"
      }
    },
    creator: {
      placeholder: "Enter the creator name",
      type: "TextInput"
    },
    credit: {
      placeholder: "Enter a credit for attribution purposes",
      type: "TextInput"
    },
    altText: {
      placeholder: "Enter alternative text as necessary",
      type: "TextInput"
    },
    originalPublicationDate: {
      placeholder: "Enter original publication date",
      type: "Date"
    }
  }
};
