import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addIllegalMovesThunk } from "../../../features/thunks/illegalMovesThunk";

const ExamSecurityHandler = ({ onIllegalAction }) => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId"); // kendi yapına göre kontrol et

  const handleIllegalAction = (description) => {
    if (userId) {
      dispatch(addIllegalMovesThunk({ move: description, userId }));
    }
    onIllegalAction?.(description);
  };

  useEffect(() => {
    let initialFullscreenCheckDone = false;

    const requestFullscreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    };

    const handleFullscreenChange = () => {
      if (!initialFullscreenCheckDone) {
        initialFullscreenCheckDone = true;
        return;
      }
      if (!document.fullscreenElement) {
        handleIllegalAction(
          "Tam ekran modundan çıktınız, tekrar tam ekran moduna geçiliyor."
        );
        requestFullscreen();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "F11") {
        e.preventDefault();
        handleIllegalAction(
          "F11 tuşu engellendi: Tam ekran modundan çıkamazsınız."
        );
        if (!document.fullscreenElement) {
          requestFullscreen();
        }
      }

      const illegalKeys = [
        "F12",
        "F5",
        "F10",
        "F9",
        "PrintScreen",
        "printscreen",
        "Escape",
      ];
      const ctrlCombos = e.ctrlKey && illegalKeys.includes(e.key);
      const ctrlShiftCombos =
        e.ctrlKey &&
        e.shiftKey &&
        ["I", "ı", "i", "İ", "J", "j"].includes(e.key);
      const altF4 = e.altKey && e.key === "F4";
      const isMeta = e.key === "Meta";

      if (
        illegalKeys.includes(e.key) ||
        ctrlCombos ||
        ctrlShiftCombos ||
        altF4 ||
        isMeta
      ) {
        e.preventDefault();
        handleIllegalAction(`Engellenen tuş: ${e.key}`);
      }
    };

    const handleRightClick = (e) => {
      e.preventDefault();
      handleIllegalAction("Sağ tıklama engellendi.");
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("contextmenu", handleRightClick);

    if (!document.fullscreenElement) {
      requestFullscreen();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("contextmenu", handleRightClick);
    };
  }, [userId]);

  return null;
};

export default ExamSecurityHandler;
