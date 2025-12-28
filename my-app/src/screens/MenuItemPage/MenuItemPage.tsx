import React, { useState } from "react";
import "./MenuItemPage.css";
import { ArrowLeft, Search } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MenuItemDto } from "../../entities/menuItem/MenuItemDto";
import { useGetMenuItemsByBakeryIdQuery } from "../../apis/menuItemQueryApi";
import { MenuItemCard } from "../../components/MenuItemCard/MenuItemCard";
import { useTranslation } from "react-i18next";

export const MenuPage: React.FC = () => {
  const { bakeryId } = useParams<{ bakeryId: string }>();
  const parsedBakeryId = bakeryId ? parseInt(bakeryId, 10) : undefined;

  const { t } = useTranslation();

  const {
    data: menuItems,
    isLoading,
    error,
  } = useGetMenuItemsByBakeryIdQuery(parsedBakeryId!, {
    skip: !parsedBakeryId,
  });
  const navigate = useNavigate();
  const location = useLocation();

  const bakeryName = location.state?.bakeryName;
  const [searchTerm, setSearchTerm] = useState("");

  const handleBack = () => {
    navigate(-1);
  };

  const filteredMenuItems = menuItems?.filter(
    (item: MenuItemDto) =>
      item.cake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cake.ingredients.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cake.flavour.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!parsedBakeryId) {
    return (
      <div className="menu-page">
        <div className="error-container">
          <p>{t("error_bakery_not_selected")}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="menu-page">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>{t("loading_menu")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-page">
        <div className="error-container">
          <p>{t("error_loading_menu")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <div className="wave">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="menu-content">
        <div className="menu-header">
          <button
            onClick={handleBack}
            className="back-button"
            aria-label={t("aria_go_back")}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="menu-title">
            {bakeryName
              ? t("menu_title_dynamic", { name: bakeryName })
              : t("our_menu")}
          </h1>
          <p className="menu-subtitle">{t("menu_subtitle")}</p>
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder={t("search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {filteredMenuItems && filteredMenuItems.length > 0 ? (
          <div className="menu-grid">
            {filteredMenuItems.map((menuItem) => (
              <MenuItemCard key={menuItem.id} menuItem={menuItem} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>{t("no_menu_results")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
