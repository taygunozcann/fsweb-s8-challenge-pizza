import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function Success() {
  return (
    <main className="success-page">
      <section className="success-content">
        <img className="success-img" src="../../images/iteration-1-images/logo.svg" alt="" />
        <p>TEBRİKLER!</p>
        <h1>SİPARİŞİNİZ ALINDI!</h1>
        <Link to="/siparis" className="success-link">Yeni Sipariş</Link>
      </section>
    </main>
  );
}
