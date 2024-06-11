import readChangesets from '@changesets/read';
import { type Package, getPackages } from '@manypkg/get-packages';

type VersionType = 'major' | 'minor' | 'patch' | 'none';
type Release = {
  name: string;
  type: VersionType;
};
type Changeset = {
  summary: string;
  releases: Array<Release>;
};
type NewChangeset = Changeset & {
  id: string;
};

function checkChangeset(packages: Package[], changesets: NewChangeset[]) {
  for (const changeset of changesets) {
    const { id, releases } = changeset;

    for (const release of releases) {
      if (release.type === 'major') {
        throw Error(
          `[changeset checker] Find a major version changeset file "${id}.md" for "${release.name}" package.\nPlease confirm whether you need to bump a major version.`,
        );
      }
      if (!packages.find((pkg) => pkg.packageJson.name === release.name)) {
        throw Error(`package ${release.name} is not found in ${id}.md file`);
      }
    }
  }
}

export async function run() {
  const cwd = process.cwd();
  const { packages } = await getPackages(cwd);
  const changesets = await readChangesets(cwd, process.env.BASE_BRANCH);
  checkChangeset(packages, changesets);
}

