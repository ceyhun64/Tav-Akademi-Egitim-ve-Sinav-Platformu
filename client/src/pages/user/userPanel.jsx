import React from "react";
import Navbar from "../../components/user/userPanel/navbar";
import UpcomingExam from "../../components/user/userPanel/upcomingExam";
import ContinueEducation from "../../components/user/userPanel/continueEducation";
import Graphic from "../../components/user/userPanel/graphic";
import Footer from "../../layout/footer";

export default function UserPanelPage() {
  return (
    <div>
      <Navbar />
      <UpcomingExam />
      <hr className="my-4" />
      <ContinueEducation />
      <hr className="my-4" />
      <Graphic />
      <hr className="my-4" />
      <Footer />
    </div>
  );
}
