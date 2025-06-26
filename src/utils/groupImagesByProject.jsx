export default function groupImagesByProject (images, projects) {
  const grouped = {};

  Object.values(projects).forEach((projectName) => {
    grouped[projectName] = images
      .filter((img) => img.projectType === projectName)
  });

  return grouped;
};

