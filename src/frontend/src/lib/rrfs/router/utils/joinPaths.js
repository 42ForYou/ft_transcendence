const joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");

export default joinPaths;
