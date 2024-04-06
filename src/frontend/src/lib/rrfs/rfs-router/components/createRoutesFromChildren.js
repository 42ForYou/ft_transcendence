import React from "react";

const createRoutesFromChildren = (children, parentPath = []) => {
  const routes = [];

  // TODO: implement this Object Children
  React.Children.forEach(children, (element, index) => {
    if (!React.isValidElement(element)) {
      return;
    }

    if (element.type === React.Fragment) {
      routes.push(...createRoutesFromChildren(element.props.children, parentPath));
      return;
    }

    const treePath = [...parentPath, index];
    const route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      index: element.props.index,
      path: element.props.path,
      loader: element.props.loader,
      action: element.props.action,
      errorElement: element.props.errorElement,
      hasErrorBoundary: element.props.errorElement !== null && element.props.errorElement !== undefined,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
    };

    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children, treePath);
    }

    routes.push(route);
  });

  return routes;
};

export default createRoutesFromChildren;
