import React, { useEffect, useState } from "react";
import "./AddBakeryModal.css";
import { useTranslation } from "react-i18next";
import { CakeDto } from "../../entities/cake/CakeDto";
import { translateText } from "../../utils/translator";
import { Sparkles } from "lucide-react";

export interface NewMenuItemData {
  id?: number;
  cake: CakeDto;
  price: number;
  quantity: number;
}

interface AddCakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewMenuItemData) => void;
  initialData?: NewMenuItemData | null;
}

export const AddCakeModal: React.FC<AddCakeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { t } = useTranslation();

  const [inputLang, setInputLang] = useState<"ro" | "en">("ro");
  const [isTranslating, setIsTranslating] = useState(false);
  const getEmptyCakeData = (): CakeDto => ({
    sweetness: 5,
    nameRo: "",
    ingredientsRo: "",
    textureRo: "",
    flavourRo: "",
    provenienceRo: "",
    nameEn: "",
    ingredientsEn: "",
    textureEn: "",
    flavourEn: "",
    provenienceEn: "",
  });
  const [cakeData, setCakeData] = useState<CakeDto>(getEmptyCakeData());
  const [menuData, setMenuData] = useState({
    price: 0,
    quantity: 1,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setCakeData(initialData.cake);
        setMenuData({
          price: initialData.price,
          quantity: initialData.quantity,
        });
      } else {
        setCakeData(getEmptyCakeData());
        setMenuData({ price: 0, quantity: 1 });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleCakeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCakeData({ ...cakeData, [e.target.name]: e.target.value });
  };

  const handleMenuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMenuData({ ...menuData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleAutoTranslate = async () => {
    setIsTranslating(true);
    const source = inputLang;
    const target = inputLang === "ro" ? "en" : "ro";

    try {
      const [name, ingr, text, flav, prov] = await Promise.all([
        translateText(
          source === "ro" ? cakeData.nameRo : cakeData.nameEn!,
          source,
          target,
        ),
        translateText(
          source === "ro" ? cakeData.ingredientsRo : cakeData.ingredientsEn!,
          source,
          target,
        ),
        translateText(
          source === "ro" ? cakeData.textureRo : cakeData.textureEn!,
          source,
          target,
        ),
        translateText(
          source === "ro" ? cakeData.flavourRo : cakeData.flavourEn!,
          source,
          target,
        ),
        translateText(
          source === "ro" ? cakeData.provenienceRo : cakeData.provenienceEn!,
          source,
          target,
        ),
      ]);

      setCakeData((prev) => ({
        ...prev,
        [source === "ro" ? "nameEn" : "nameRo"]: name,
        [source === "ro" ? "ingredientsEn" : "ingredientsRo"]: ingr,
        [source === "ro" ? "textureEn" : "textureRo"]: text,
        [source === "ro" ? "flavourEn" : "flavourRo"]: flav,
        [source === "ro" ? "provenienceEn" : "provenienceRo"]: prov,
      }));
    } catch (error) {
      console.error("Translation failed", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = () => {
    if (!cakeData.nameRo && !cakeData.nameEn) {
      alert(t("fill_ro_first") || "Please fill the name!");
      return;
    }
    onSave({
      id: initialData?.id,
      cake: cakeData,
      price: menuData.price,
      quantity: menuData.quantity,
    });
  };

  return (
    <div className="add-bakery-overlay">
      <div
        className="add-bakery-modal"
        style={{ maxWidth: "700px", width: "95%" }}
      >
        <h3 className="add-bakery-title">{t("add_cake_title")}</h3>

        <div
          style={{
            marginBottom: 15,
            display: "flex",
            justifyContent: "center",
            gap: 10,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
            {t("select_input_lang")}
          </span>
          <div style={{ display: "flex", gap: 5 }}>
            <button
              className={`location-btn ${inputLang === "ro" ? "selected" : ""}`}
              style={{ padding: "5px 15px" }}
              onClick={() => setInputLang("ro")}
            >
              RO 🇷🇴
            </button>
            <button
              className={`location-btn ${inputLang === "en" ? "selected" : ""}`}
              style={{ padding: "5px 15px" }}
              onClick={() => setInputLang("en")}
            >
              EN 🇬🇧
            </button>
          </div>
        </div>

        <div
          className="add-bakery-form"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <h4 style={{ margin: 0, fontSize: "0.9rem", color: "#6d4c41" }}>
              {inputLang === "ro" ? "Română (Sursă)" : "English (Source)"}
            </h4>
            <input
              name={inputLang === "ro" ? "nameRo" : "nameEn"}
              value={inputLang === "ro" ? cakeData.nameRo : cakeData.nameEn}
              onChange={handleCakeChange}
              placeholder={t("cake_name")}
              className="bakery-input"
            />
            <textarea
              rows={3}
              name={inputLang === "ro" ? "ingredientsRo" : "ingredientsEn"}
              value={
                inputLang === "ro"
                  ? cakeData.ingredientsRo
                  : cakeData.ingredientsEn
              }
              onChange={handleCakeChange}
              placeholder={t("ingredients")}
              className="bakery-input"
            />
            <input
              name={inputLang === "ro" ? "textureRo" : "textureEn"}
              value={
                inputLang === "ro" ? cakeData.textureRo : cakeData.textureEn
              }
              onChange={handleCakeChange}
              placeholder={t("texture")}
              className="bakery-input"
            />
            <input
              name={inputLang === "ro" ? "flavourRo" : "flavourEn"}
              value={
                inputLang === "ro" ? cakeData.flavourRo : cakeData.flavourEn
              }
              onChange={handleCakeChange}
              placeholder={t("flavour")}
              className="bakery-input"
            />
            <input
              name={inputLang === "ro" ? "provenienceRo" : "provenienceEn"}
              value={
                inputLang === "ro"
                  ? cakeData.provenienceRo
                  : cakeData.provenienceEn
              }
              onChange={handleCakeChange}
              placeholder={t("provenience")}
              className="bakery-input"
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              opacity: 0.9,
            }}
          >
            <h4 style={{ margin: 0, fontSize: "0.9rem", color: "#6d4c41" }}>
              {inputLang === "ro" ? "English (Auto)" : "Română (Auto)"}
            </h4>
            <input
              name={inputLang === "ro" ? "nameEn" : "nameRo"}
              value={inputLang === "ro" ? cakeData.nameEn : cakeData.nameRo}
              onChange={handleCakeChange}
              placeholder="..."
              className="bakery-input"
              readOnly
              style={{ background: "#f0f0f0" }}
            />
            <textarea
              rows={3}
              name={inputLang === "ro" ? "ingredientsEn" : "ingredientsRo"}
              value={
                inputLang === "ro"
                  ? cakeData.ingredientsEn
                  : cakeData.ingredientsRo
              }
              onChange={handleCakeChange}
              placeholder="..."
              className="bakery-input"
              readOnly
              style={{ background: "#f0f0f0" }}
            />
            <input
              name={inputLang === "ro" ? "textureEn" : "textureRo"}
              value={
                inputLang === "ro" ? cakeData.textureEn : cakeData.textureRo
              }
              onChange={handleCakeChange}
              placeholder="..."
              className="bakery-input"
              readOnly
              style={{ background: "#f0f0f0" }}
            />
            <input
              name={inputLang === "ro" ? "flavourEn" : "flavourRo"}
              value={
                inputLang === "ro" ? cakeData.flavourEn : cakeData.flavourRo
              }
              onChange={handleCakeChange}
              placeholder="..."
              className="bakery-input"
              readOnly
              style={{ background: "#f0f0f0" }}
            />
            <input
              name={inputLang === "ro" ? "provenienceEn" : "provenienceRo"}
              value={
                inputLang === "ro"
                  ? cakeData.provenienceEn
                  : cakeData.provenienceRo
              }
              onChange={handleCakeChange}
              placeholder="..."
              className="bakery-input"
              readOnly
              style={{ background: "#f0f0f0" }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "15px",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: "bold",
                color: "#5d4037",
              }}
            >
              {t("sweetness_level")}: {cakeData.sweetness}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              name="sweetness"
              value={cakeData.sweetness || 5}
              onChange={(e) =>
                setCakeData({
                  ...cakeData,
                  sweetness: parseInt(e.target.value),
                })
              }
              style={{ width: "100%", accentColor: "#6d4c41" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: "bold",
                color: "#5d4037",
              }}
            >
              Price (RON)
            </label>
            <input
              type="number"
              name="price"
              value={menuData.price}
              onChange={handleMenuChange}
              className="bakery-input"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: "bold",
                color: "#5d4037",
              }}
            >
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={menuData.quantity}
              onChange={handleMenuChange}
              className="bakery-input"
            />
          </div>
        </div>

        <button
          className="location-btn"
          style={{
            width: "100%",
            marginTop: "15px",
            background: "linear-gradient(45deg, #d7b49e, #fffaf4)",
            border: "2px solid #d7b49e",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={handleAutoTranslate}
          disabled={isTranslating}
        >
          {isTranslating ? t("translating") : t("auto_translate_btn")}
          <Sparkles size={18} />
        </button>

        <div className="modal-actions">
          <button className="modal-btn cancel-btn" onClick={onClose}>
            {t("cancel")}
          </button>
          <button className="modal-btn save-btn" onClick={handleSubmit}>
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
};
