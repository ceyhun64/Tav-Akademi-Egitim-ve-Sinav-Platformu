import { useEffect } from "react";

const ExamSecurityHandler = ({ onIllegalAction }) => {
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
        onIllegalAction?.(
          "Tam ekran modundan çıktınız, tekrar tam ekran moduna geçiliyor."
        );
        requestFullscreen();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "F11") {
        e.preventDefault();
        onIllegalAction?.(
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
        // "U",
        // "u",
        // "J",
        // "j",
        // "P",
        // "p",
        // "R",
        // "r",
        // "W",
        // "w",
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
        onIllegalAction?.(e.key);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    if (!document.fullscreenElement) {
      requestFullscreen();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [onIllegalAction]);

  return null;
};

export default ExamSecurityHandler;
