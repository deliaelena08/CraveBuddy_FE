import React, { useEffect, useState } from "react";
import "./AddCakeModal.css";
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      setErrors({});

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
    const { name, value } = e.target;
    setCakeData({ ...cakeData, [name]: value });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMenuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMenuData({ ...menuData, [name]: parseFloat(value) });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const nameField = inputLang === "ro" ? "nameRo" : "nameEn";
    const nameVal = inputLang === "ro" ? cakeData.nameRo : cakeData.nameEn;
    if (!nameVal || !nameVal.trim()) {
      newErrors[nameField] = t("err_name_req", "Numele este obligatoriu!");
    }

    const ingrField = inputLang === "ro" ? "ingredientsRo" : "ingredientsEn";
    const ingrVal =
      inputLang === "ro" ? cakeData.ingredientsRo : cakeData.ingredientsEn;
    if (!ingrVal || !ingrVal.trim()) {
      newErrors[ingrField] = t(
        "err_ingr_req",
        "Ingredientele sunt obligatorii!",
      );
    }

    const textField = inputLang === "ro" ? "textureRo" : "textureEn";
    const textVal =
      inputLang === "ro" ? cakeData.textureRo : cakeData.textureEn;
    if (!textVal || !textVal.trim()) {
      newErrors[textField] = t("err_texture_req", "Textura este obligatorie!");
    }

    const flavField = inputLang === "ro" ? "flavourRo" : "flavourEn";
    const flavVal =
      inputLang === "ro" ? cakeData.flavourRo : cakeData.flavourEn;
    if (!flavVal || !flavVal.trim()) {
      newErrors[flavField] = t("err_flavour_req", "Aroma este obligatorie!");
    }

    if (menuData.price <= 0 || isNaN(menuData.price)) {
      newErrors.price = t("err_price_invalid", "Preț invalid!");
    }
    if (menuData.quantity <= 0 || isNaN(menuData.quantity)) {
      newErrors.quantity = t("err_quantity_invalid", "Cantitate invalidă!");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onSave({
      id: initialData?.id,
      cake: cakeData,
      price: menuData.price,
      quantity: menuData.quantity,
    });

    setCakeData(getEmptyCakeData());
    setMenuData({ price: 0, quantity: 1 });
  };

  const fName = inputLang === "ro" ? "nameRo" : "nameEn";
  const fIngr = inputLang === "ro" ? "ingredientsRo" : "ingredientsEn";
  const fText = inputLang === "ro" ? "textureRo" : "textureEn";
  const fFlav = inputLang === "ro" ? "flavourRo" : "flavourEn";
  const fProv = inputLang === "ro" ? "provenienceRo" : "provenienceEn";

  return (
    <div className="add-cake-overlay">
      <div className="add-cake-modal">
        <h3 className="add-cake-title">{t("add_cake_title")}</h3>

        <div className="lang-selector-container">
          <span className="lang-selector-label">{t("select_input_lang")}</span>
          <div className="lang-selector-buttons">
            <button
              className={`lang-btn ${inputLang === "ro" ? "selected" : ""}`}
              onClick={() => setInputLang("ro")}
            >
              RO 🇷🇴
            </button>
            <button
              className={`lang-btn ${inputLang === "en" ? "selected" : ""}`}
              onClick={() => setInputLang("en")}
            >
              EN 🇬🇧
            </button>
          </div>
        </div>

        <div className="add-cake-form">
          <div className="form-column">
            <h4 className="column-title">
              {inputLang === "ro" ? "Română (Sursă)" : "English (Source)"}
            </h4>

            <input
              name={fName}
              value={cakeData[fName as keyof CakeDto] as string}
              onChange={handleCakeChange}
              placeholder={t("cake_name")}
              className={`cake-input ${errors[fName] ? "input-error" : ""}`}
              maxLength={50}
            />
            {errors[fName] && (
              <span className="error-text">{errors[fName]}</span>
            )}

            <textarea
              rows={3}
              name={fIngr}
              value={cakeData[fIngr as keyof CakeDto] as string}
              onChange={handleCakeChange}
              placeholder={t("ingredients")}
              className={`cake-input ${errors[fIngr] ? "input-error" : ""}`}
              maxLength={500}
            />
            {errors[fIngr] && (
              <span className="error-text">{errors[fIngr]}</span>
            )}

            <input
              name={fText}
              value={cakeData[fText as keyof CakeDto] as string}
              onChange={handleCakeChange}
              placeholder={t("texture")}
              className={`cake-input ${errors[fText] ? "input-error" : ""}`}
              maxLength={500}
            />
            {errors[fText] && (
              <span className="error-text">{errors[fText]}</span>
            )}

            <input
              name={fFlav}
              value={cakeData[fFlav as keyof CakeDto] as string}
              onChange={handleCakeChange}
              placeholder={t("flavour")}
              className={`cake-input ${errors[fFlav] ? "input-error" : ""}`}
              maxLength={500}
            />
            {errors[fFlav] && (
              <span className="error-text">{errors[fFlav]}</span>
            )}

            <input
              name={fProv}
              value={cakeData[fProv as keyof CakeDto] as string}
              onChange={handleCakeChange}
              placeholder={t("provenience")}
              className="cake-input"
              maxLength={255}
            />
          </div>

          <div className="form-column auto-translate">
            <h4 className="column-title">
              {inputLang === "ro" ? "English (Auto)" : "Română (Auto)"}
            </h4>

            <input
              name={inputLang === "ro" ? "nameEn" : "nameRo"}
              value={inputLang === "ro" ? cakeData.nameEn : cakeData.nameRo}
              onChange={handleCakeChange}
              placeholder="..."
              className="cake-input readonly-input"
              readOnly
              maxLength={50}
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
              className="cake-input readonly-input"
              readOnly
              maxLength={500}
            />
            <input
              name={inputLang === "ro" ? "textureEn" : "textureRo"}
              value={
                inputLang === "ro" ? cakeData.textureEn : cakeData.textureRo
              }
              onChange={handleCakeChange}
              placeholder="..."
              className="cake-input readonly-input"
              readOnly
              maxLength={500}
            />
            <input
              name={inputLang === "ro" ? "flavourEn" : "flavourRo"}
              value={
                inputLang === "ro" ? cakeData.flavourEn : cakeData.flavourRo
              }
              onChange={handleCakeChange}
              placeholder="..."
              className="cake-input readonly-input"
              readOnly
              maxLength={500}
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
              className="cake-input readonly-input"
              readOnly
              maxLength={255}
            />
          </div>
        </div>

        <div className="details-row">
          <div className="detail-item">
            <label className="detail-label">
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
              className="sweetness-range"
            />
          </div>
          <div className="detail-item">
            <label className="detail-label">Price (RON)</label>
            <input
              type="number"
              name="price"
              value={menuData.price}
              onChange={handleMenuChange}
              className={`cake-input ${errors.price ? "input-error" : ""}`}
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>
          <div className="detail-item">
            <label className="detail-label">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={menuData.quantity}
              onChange={handleMenuChange}
              className={`cake-input ${errors.quantity ? "input-error" : ""}`}
            />
            {errors.quantity && (
              <span className="error-text">{errors.quantity}</span>
            )}
          </div>
        </div>

        <button
          className="auto-translate-btn"
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
