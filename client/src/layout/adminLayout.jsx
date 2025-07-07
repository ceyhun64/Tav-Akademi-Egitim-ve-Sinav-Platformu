import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logoutThunk } from "../features/thunks/authThunk";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const timerId = useRef(null);

  const resetTimer = () => {
    if (timerId.current) clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      dispatch(logoutThunk());
      alert("20 dakika işlem yapılmadığı için oturum kapatıldı.");
    }, 20 * 60 * 1000); // 20 dakika
  };

  useEffect(() => {
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("scroll", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer();

    return () => {
      if (timerId.current) clearTimeout(timerId.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}
