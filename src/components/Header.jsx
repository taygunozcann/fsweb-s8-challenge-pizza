import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  return (
    <header className="site-header">
      <Link to="/" className="brand">
        <img src="../../images/iteration-1-images/logo.svg" alt="" />
      </Link>
      {location.pathname !== "/" && (
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Anasayfa</Link>
          <span>-</span>
          <span>Seçenekler</span>
          <span>-</span>
          <strong>{location.pathname === "/success" ? "Sipariş Sonucu" : "Sipariş Oluştur"}</strong>
        </nav>
      )}
    </header>
  );
}