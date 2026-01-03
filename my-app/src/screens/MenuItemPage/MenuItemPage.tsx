import React, { useState } from "react";
import "./MenuItemPage.css";
import { ArrowLeft, Search, Plus, Trash2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MenuItemDto } from "../../entities/menuItem/MenuItemDto";
import {
  useGetMenuItemsByBakeryIdQuery,
  useCreateMenuItemMutation,
  useDeleteMenuItemMutation,
} from "../../apis/menuItemQueryApi";
import { useCreateCakeMutation } from "../../apis/cakeQueryApi";
import { MenuItemCard } from "../../components/MenuItemCard/MenuItemCard";
import { useTranslation } from "react-i18next";
import {
  AddCakeModal,
  NewMenuItemData,
} from "../../components/Modals/AddCakeModal";
import { useNotificationSystem } from "../../utils/useNotificationSystem";
import { BakeryDto } from "../../entities/bakery/BakeryDto";

export const MenuPage: React.FC = () => {
  const { bakeryId } = useParams<{ bakeryId: string }>();
  const parsedBakeryId = bakeryId ? parseInt(bakeryId, 10) : undefined;

  const { t } = useTranslation();
  const { notify } = useNotificationSystem();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: menuItems,
    isLoading,
    error,
  } = useGetMenuItemsByBakeryIdQuery(parsedBakeryId!, {
    skip: !parsedBakeryId,
  });

  const [createCake] = useCreateCakeMutation();
  const [createMenuItem] = useCreateMenuItemMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();

  const bakeryName = location.state?.bakeryName;
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCakeModal, setShowAddCakeModal] = useState(false);

  const userStr = localStorage.getItem("user");
  const storedUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = storedUser?.role === "ADMIN";

  const handleBack = () => {
    navigate(-1);
  };

  const handleSaveMenuItem = async (data: NewMenuItemData) => {
    if (!parsedBakeryId) return;

    try {
      const savedCake = await createCake(data.cake).unwrap();
      const newMenuItem: MenuItemDto = {
        cake: savedCake,
        bakery: { id: parsedBakeryId } as BakeryDto,
        price: data.price,
        quantity: data.quantity,
      };

      await createMenuItem(newMenuItem).unwrap();

      notify(t("cake_added_success"), "success");
      setShowAddCakeModal(false);
    } catch (err) {
      console.error("Error creating menu item chain:", err);
      notify(t("cake_add_error"), "error");
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    if (window.confirm(t("confirm_delete_msg"))) {
      try {
        await deleteMenuItem(id).unwrap();
        notify(t("delete_success"), "success");
      } catch (err) {
        console.error("Delete failed", err);
        notify(t("delete_error"), "error");
      }
    }
  };

  const filteredMenuItems = menuItems?.filter((item: MenuItemDto) => {
    const term = searchTerm.toLowerCase();

    const nameMatch =
      item.cake.nameRo?.toLowerCase().includes(term) ||
      item.cake.nameEn?.toLowerCase().includes(term);

    const ingredientMatch =
      item.cake.ingredientsRo?.toLowerCase().includes(term) ||
      item.cake.ingredientsEn?.toLowerCase().includes(term);

    return nameMatch || ingredientMatch;
  });

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

        {isAdmin && (
          <button
            className="admin-add-cake-btn"
            onClick={() => setShowAddCakeModal(true)}
            title={t("add_cake_title")}
          >
            <Plus size={24} color="white" />
          </button>
        )}

        <AddCakeModal
          isOpen={showAddCakeModal}
          onClose={() => setShowAddCakeModal(false)}
          onSave={handleSaveMenuItem}
        />

        {filteredMenuItems && filteredMenuItems.length > 0 ? (
          <div className="menu-grid">
            {filteredMenuItems.map((menuItem) => (
              <div key={menuItem.id} className="menu-item-wrapper">
                <MenuItemCard menuItem={menuItem} />

                {isAdmin && (
                  <button
                    className="delete-item-btn"
                    onClick={() => handleDeleteMenuItem(menuItem.id!)}
                    title="Delete Item"
                  >
                    <Trash2 size={18} color="white" />
                  </button>
                )}
              </div>
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
