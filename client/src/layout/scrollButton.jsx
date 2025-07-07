import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo(0, 0); // Sayfayı en üstte göster
  };

  const handleScroll = () => {
    if (window.scrollY > 300) { // 300px kadar kaydırıldığında butonu göster
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Temizleme işlemi
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        style={{
          position: 'fixed',  // Sabit konumda olacak
          bottom: '30px',     // Alt kısımdan 30px uzaklık
          right: '30px',      // Sağ kısımdan 30px uzaklık
          width: '45px',      // Butonun genişliği
          height: '45px',     // Butonun yüksekliği
          backgroundColor: '#964B00', // Butonun rengi
          color: 'white',      // Yazı rengi
          border: 'none',      // Kenarlık yok
          borderRadius: '50%', // Tam daire şekli için borderRadius %50
          fontSize: '20px',    // Font boyutu
          cursor: 'pointer',   // Farenin el simgesi olması için
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Gölgelendirme efekti
          transition: 'background-color 0.3s', // Buton üzerine gelince renk değişimi
          zIndex: 9999,        // Butonu en üstte tutmak için
        }}
      >
        <i className="bi bi-arrow-up-short"></i>
      </button>
    )
  );
};

export default ScrollToTopButton;
