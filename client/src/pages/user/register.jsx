import React from "react";
import Sidebar from "../../components/admin/adminPanel/sidebar";
import Register from "../../components/admin/user/register";

export default function UserRegister() {
  return (
    <div className="row">
      <div className="col-md-2">
        <Sidebar />
      </div>
      <div className="col-md-10">
        <Register />
      </div>
    </div>
  );
}
