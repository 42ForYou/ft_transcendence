import React from "react";
import { useLocation, Outlet } from "../../lib/rrfs/index.js";
import NavigationBar from "../layout/NavigationBar";
import { shouldHideNavbar } from "../../utils/navigationUtils";

const MainLayout = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/callback", "/game/waiting/:room_id", "/game/play/:game_id"];
  const showNavbar = !shouldHideNavbar(location.pathname, hideNavbarRoutes);

  return (
    <div className="MainLayout container-fluid h-100">
      <div className="row">
        {showNavbar && (
          <div className="col-2 p-0">
            <NavigationBar />
          </div>
        )}
        <div className="col p-0">
          <Outlet />
          {/* 자식 라우트의 컴포넌트를 렌더링 */}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
