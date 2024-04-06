const getPathContributingMatches = (matches) => {
  return matches.filter((match, index) => index === 0 || (match.route.path && match.route.path.length > 0));
};

export default getPathContributingMatches;
