import React from "react";
import { Link, useNavigate } from "../../lib/rrfs/index.js";
import { useAuth } from "../../context/AuthContext";

import Avatar from "../common/Avatar";
import Icon from "../common/Icon";

const NavItem = ({ label, to, icon }) => {
  return (
    <li className="NavItem flex-1 mb-4">
      <div className="d-flex justify-content-start">
        <Link to={to} className="d-flex flex-grow justify-content-start">
          {icon && <Icon filename={`${icon}.png`} alt={label} invert={true} />}
          <p className="nav-link flex-grow ms-3 mb-0">{label}</p>
        </Link>
      </div>
    </li>
  );
};

const NavItems = () => {
  return (
    <ul className="NavItems d-flex-col p-0">
      <NavItem to={"/"} label="Home" icon={"home"} />
      <NavItem to={"/game/list"} label="Games" icon={"pong"} />
      <NavItem to={"/friends"} label="Friends" icon={"handshake"} />
      <NavItem to={"/users"} label="Users" icon={"people"} />
    </ul>
  );
};

const NavUser = () => {
  const { loggedInUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    alert("로그아웃 되었습니다. \n로그인 페이지로 이동합니다");
    navigate("/login");
  };

  const avatarSrc = loggedInUser ? loggedInUser.avatar : null;
  const nickname = loggedInUser ? loggedInUser.nickname : "Unknown User";

  return (
    <div className="NavUser d-flex flex-column align-items-center pb-3">
      <p className="mb-3 text-center">{nickname}</p>
      <Avatar src={avatarSrc} to={"/profile"} diameter={120} />
      <div className="d-flex w-100 justify-content-end">
        <button
          className="btn btn-secondary mt-2 w-40 "
          onClick={handleLogout}
          style={{ border: "none", background: "none", padding: 0 }}>
          <Icon filename={"logout.png"} alt={"logout"} invert={true} />
        </button>
      </div>
    </div>
  );
};

const NavLogo = () => {
  return (
    <h1 className="NavLogo mt-3 mb-4">
      <Link to="/">
        <img src={`${process.env.ASSETS_URL}/logo-3-color3.png`} alt="logo" />
      </Link>
    </h1>
  );
};

const NavigationBar = () => {
  return (
    <div className="NavigationBar h-100">
      <nav className="NavigationBar-Content d-flex-col justify-content-between h-100 px-3 pb-4">
        <div>
          <NavLogo />
          <NavItems />
        </div>
        <NavUser />
      </nav>
    </div>
  );
};

export default React.memo(NavigationBar);
