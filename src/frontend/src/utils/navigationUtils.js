export const shouldHideNavbar = (locationPathname, hideNavbarRoutes) => {
  if (locationPathname === "/") return false;
  const hideNavbarRegex = hideNavbarRoutes.map((route) => {
    const regexPattern = route.replace(/:[^\s/]+/g, "[^/]+").replace(/\*/g, ".*");
    return new RegExp(`^${regexPattern}$`);
  });
  return hideNavbarRegex.some((regex) => regex.test(locationPathname));
};
