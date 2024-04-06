import { useOutlet } from "../hooks";

const Outlet = (props) => {
  return useOutlet(props.context);
};

export default Outlet;
