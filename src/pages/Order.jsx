import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

const INGREDIENTS = [
  "Pepperoni", "Domates", "Biber",
  "Sosis", "Mısır", "Sucuk",
  "Kanada Jambonu", "Ananas", "Tavuk Izgara",
  "Jalapeno", "Kabak", "Soğan",
  "Sarımsak", "Zeytin", "Mantar"
];

const SIZE_PRICES = { Küçük: 0, Orta: 15, Büyük: 25 };
const INGREDIENT_PRICE = 5;

export default function Order() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    thickness: "",
    ingredients: [],
    notes: "",
    quantity: 1
  })
  /*const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [thickness, setThickness] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);*/
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const isValid = formData.name.trim().length >= 3
    && Boolean(formData.size)
    && formData.ingredients.length >= 4
    && formData.ingredients.length <= 10
    && Boolean(formData.thickness);

  const base = 85.5;
  const sizeExtra = SIZE_PRICES[formData.size] ?? 0;
  const ingredientExtra = formData.ingredients.length * INGREDIENT_PRICE;

  const total = (base + sizeExtra + ingredientExtra) * formData.quantity;

  function toggleIngredient(item) {
    
    setFormData((prevData) => {
      if (prevData.ingredients.length >= 10){
        return {... prevData, ingredients: [...prevData.ingredients]};
      }
      if (prevData.ingredients.includes(item)){
        return {... prevData, ingredients: prevData.ingredients.filter((x) => x !== item)};
      }
      else{
        return {... prevData, ingredients: [...prevData.ingredients, item]};
      }
       
    });
  }

  function handleThickness(event) {
    setFormData((prevData)=>({...prevData, thickness: event.target.value}))
  }

  function handleName(event) {
    setFormData((prevData)=>({...prevData, name:event.target.value}))
  }
  function handleNote(event) {
    setFormData((prevData)=>({...prevData, note:event.target.value}))
  }
  function handleSize(event) {
    setFormData((prevData)=>({...prevData, size:event.target.value}))
  }
  function handleIncreaseQuantity() {
    setFormData((prevData)=>({...prevData, quantity:prevData.quantity+1}))
  }
  function handleDecreaseQuantity() {
    setFormData((prevData)=>({...prevData, quantity: Math.max(1, prevData.quantity-1)}))
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // JS tarafında ikinci güvenlik katmanı: disabled buton atlatılsa bile istek gitmez.
    if (!isValid || isSending) {
      setError("Lütfen zorunlu alanları doğru şekilde doldurun.");
      return;
    }

    const payload = {
      isim: formData.name.trim(),
      boyut: formData.size,
      malzemeler: formData.ingredients,
      ozel: formData.notes.trim(),
      adet: formData.quantity,
      toplam: Number(total.toFixed(2))
    };

    setError("");
    setIsSending(true);

    try {
      const response = await axios.post(
        "https://reqres.in/api/pizza",
        payload,
        {
          headers: {
            "x-api-key": "free_user_3IsRrxSjEEh2QJv8um3DksAltCb",
            "Content-Type": "application/json"
          }
        }
      );

      console.log("API Response:", response.data);
      console.log("Sipariş Özeti:", {
        id: response.data?.id,
        tarih: response.data?.createdAt,
        isim: response.data?.isim,
        boyut: response.data?.boyut,
        malzemeler: response.data?.malzemeler,
        ozel: response.data?.ozel,
        adet: response.data?.adet,
        toplam: response.data?.toplam
      });

      history.push("/success");
    } catch (err) {
      console.error("Sipariş gönderilemedi:", err);
      setError("Sipariş gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="order-page">
      <Header />
      <section className="order-shell">
        <div className="product-info">
          <h1>Position Absolute Acı Pizza</h1>
          <div className="product-meta">
            <strong>85.50₺</strong>
            <span>4.9</span>
            <span>(200)</span>
          </div>
          <p>
            Frontend Dev olarak hala position:absolute kullanıyorsan bu çok acı
            pizza tam sana göre. Pizza, domates, peynir ve genellikle çeşitli
            diğer malzemelerle kaplanmış, daha sonra geleneksel olarak odun
            ateşinde bir fırında yüksek sıcaklıkta pişirilen, genellikle yuvarlak,
            düzleştirilmiş mayalı buğday bazlı hamurdan oluşan İtalyan kökenli
            lezzetli bir yemektir.
          </p>
        </div>

        <form className="order-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row top-row">
            <fieldset>
              <legend>Boyut Seç <span>*</span></legend>
              {["Küçük", "Orta", "Büyük"].map((item) => (
                <label className="radio-option" key={item}>
                  <input
                    type="radio"
                    name="boyut"
                    value={item}
                    checked={formData.size === item}
                    onChange={handleSize}
                    required
                  />
                  <span>{item}</span>
                </label>
              ))}
            </fieldset>
            <div className="select-field">
                <label>
                  Hamur Seç <span>*</span>
                  <br />
                  <br />
                  <select value={formData.thickness} onChange={handleThickness} >
                    <option value="" disabled hidden>
                      Hamur Kalınlığı
                    </option>
                    <option value="ince">İnce</option>
                    <option value="orta">Orta</option>
                    <option value="kalin">Kalın</option>
                  </select>
                </label>
            </div>
            
          </div>

          <fieldset className="ingredients">
            <legend>Ek Malzemeler</legend>
            <p>En fazla 10 malzeme seçebilirsiniz. <strong>{formData.ingredients.length}/10</strong></p>
            <div className="ingredient-grid">
              {INGREDIENTS.map((item) => (
                <label className="check-option" key={item}>
                  <input
                    type="checkbox"
                    value={item}
                    checked={formData.ingredients.includes(item)}
                    onChange={() => toggleIngredient(item)}
                    disabled={!formData.ingredients.includes(item) && formData.ingredients.length >= 10}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            {formData.ingredients.length < 4 && (
              <small className="field-error">En az 4 malzeme seçmelisiniz.</small>
            )}
          </fieldset>
            <br/>
            <br/>
          <div className="select-field">
              <label htmlFor="name">İsim <span>*</span></label>
              <input
                id="name"
                name="isim"
                type="text"
                value={formData.name}
                minLength={3}
                required
                placeholder="Adınız"
                onChange={handleName}
              />
              {formData.name.length > 0 && formData.name.trim().length < 3 && (
                <small className="field-error">İsim en az 3 karakter olmalı.</small>
              )}
          </div>

          <div className="notes-field">
            <label htmlFor="notes">Sipariş Notu</label>
            <textarea
              id="notes"
              value={formData.note}
              onChange={handleNote}
              placeholder="Siparişine eklemek istediğin bir not var mı?"
              rows="4"
            />
          </div>

          <div className="checkout">
            <div className="quantity">
              <button type="button" onClick={handleDecreaseQuantity}>−</button>
              <span>{formData.quantity}</span>
              <button type="button" onClick={handleIncreaseQuantity}>+</button>
            </div>

            <div className="summary">
              <h2>Sipariş Toplamı</h2>
              <div><span>Seçimler</span><strong>{(formData.ingredients.length * INGREDIENT_PRICE + (SIZE_PRICES[formData.size] ?? 0)).toFixed(2)}₺</strong></div>
              <div className="total-line"><span>Toplam</span><strong>{total.toFixed(2)}₺</strong></div>
              {error && <p className="submit-error">{error}</p>}
              <button
                className="primary-button submit-button"
                type="submit"
                disabled={!isValid || isSending}
              >
                {isSending ? "GÖNDERİLİYOR..." : "SİPARİŞ VER"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
