export default function classAbilities() {
  return {
    annotation: { create: true, read: true },
    comment: { create: true, read: true },
    project: { create: true, read: true },
    projectCollection: { create: true, read: true, update: true },
    permission: { create: true, read: true },
    resource: { create: true, read: true },
    settings: { create: true, read: true, update: true },
    statistics: { create: true, read: true },
    subject: { create: true, read: true },
    text: { create: true, read: true, update: true },
    user: { create: true, read: true, update: true },
    version: { create: true, read: true }
  };
}
