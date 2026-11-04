import { Link } from "react-router-dom";
import pizza from "../../images/iteration-1-images/home-banner.png";

export default function Home() {
  return (
    <main className="hero-page">
      <section className="hero">
        <div className="hero-content">
          <img className="hero-img" src="../../images/iteration-1-images/logo.svg" alt="" />
          <p className="eyebrow">KOD ACIKTIRIR</p>
          <h1>PİZZA, DOYURUR</h1>
          <Link to="/siparis" className="primary-button hero-button">
            ACIKTIM
          </Link>
        </div>
      </section>
    </main>
  );
}
