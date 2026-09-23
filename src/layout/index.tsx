import React from "react";
import { Outlet } from "react-router";
function Layout(): React.ReactElement {
  return (
    <div>
      <div>Layout</div>
      <Outlet />
    </div>
  );
}
export default Layout;
