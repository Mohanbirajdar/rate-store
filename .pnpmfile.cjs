function readPackage(pkg) {
  // Allow build scripts for packages that need them
  const allowedBuildPackages = [
    '@prisma/client',
    '@prisma/engines',
    'prisma',
    '@tsparticles/engine',
    'react-tsparticles',
    'tsparticles-engine'
  ];

  // Allow all scripts for these packages
  if (allowedBuildPackages.includes(pkg.name)) {
    // Don't modify, just allow the build to run
  }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage
  }
};
