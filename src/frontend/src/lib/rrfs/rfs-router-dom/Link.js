import { createPath } from "../router/index.js";
import useLocation from "../rfs-router/hooks/useLocation";
import useNavigate from "../rfs-router/hooks/useNavigate";
import useResolvedPath from "../rfs-router/hooks/useResolvedPath";
import * as React from "react";
import useHref from "../rfs-router/hooks/useHref.js";

const isModifiedEvent = (event) => {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};

const shouldProcessLinkClick = (event, target) => {
  return (
    event.button === 0 && // Ignore everything but left clicks
    (!target || target === "_self") && // const browser handle "target=_blank" etc.
    !isModifiedEvent(event) // Ignore clicks with modifier keys
  );
};

const useLinkClickHandler = (to, { target, replace: replaceProp, state, preventScrollReset, relative } = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = useResolvedPath(to, { relative });

  return React.useCallback(
    (event) => {
      if (shouldProcessLinkClick(event, target)) {
        event.preventDefault();

        // If the URL hasn't changed, a regular <a> will do a replace instead of
        // a push, so do the same here unless the replace prop is explicitly set
        const replace = replaceProp !== undefined ? replaceProp : createPath(location) === createPath(path);

        navigate(to, { replace, state, preventScrollReset, relative });
      }
    },
    [location, navigate, path, replaceProp, state, target, to, preventScrollReset, relative]
  );
};

export const Link = React.forwardRef(function LinkWithRef(
  { onClick, relative, reloadDocument, replace, state, target, to, preventScrollReset, ...rest },
  ref
) {
  const href = useHref(to, { relative });
  const internalOnClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
    preventScrollReset,
    relative,
  });
  const handleClick = function (event) {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  };

  return <a {...rest} href={href} onClick={reloadDocument ? onClick : handleClick} ref={ref} target={target} />;
});

export default Link;
