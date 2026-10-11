/**
 * Hotline's outbound links and install facts, in one place so the install
 * page (/hotline) and the case study (/projects/hotline) can't drift apart.
 * The facts mirror https://github.com/PMARC14/Hotline — its README is the
 * source of truth if anything here goes stale.
 */
const repo = "https://github.com/PMARC14/Hotline";

export const hotline = {
  /** Where the dedicated install page lives on this site. */
  path: "/hotline",
  repo,
  releases: `${repo}/releases`,
  latestRelease: `${repo}/releases/latest`,
  privacy: `${repo}/blob/main/PRIVACY.md`,
  configuration: `${repo}/blob/main/docs/configuration.md`,
  license: `${repo}/blob/main/LICENSE`,
  requirements: "Windows 11 22H2 or later, on x64 or ARM64",
} as const;
