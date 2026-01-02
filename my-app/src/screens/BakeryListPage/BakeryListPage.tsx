import React, { useState } from "react";
import "./BakeryListPage.css";
import {
  useGetBakeriesQuery,
  useDeleteBakeryMutation,
  useUpdateBakeryMutation,
} from "../../apis/bakeryQueryApi";
import { BakeryDto } from "../../entities/bakery/BakeryDto";
import {
  Store,
  Trash2,
  Edit2,
  UtensilsCrossed,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Toaster } from "react-hot-toast";
import { useNotificationSystem } from "../../utils/useNotificationSystem";
import { useNavigate } from "react-router-dom";
import { EditBakeryModal } from "../../components/Modals/EditBakeryModal";

export const BakeryListPage: React.FC = () => {
  const { t } = useTranslation();
  const { notify } = useNotificationSystem();
  const navigate = useNavigate();

  const { data: bakeries = [], isLoading, error } = useGetBakeriesQuery();
  const [deleteBakery] = useDeleteBakeryMutation();
  const [updateBakery] = useUpdateBakeryMutation();

  const [editingBakery, setEditingBakery] = useState<BakeryDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id: number) => {
    if (window.confirm(t("confirm_delete_bakery") || "Delete bakery?")) {
      try {
        await deleteBakery(id).unwrap();
        notify(t("bakery_deleted_success") || "Bakery deleted!", "success");
      } catch (err) {
        console.error(err);
        notify(t("error_generic"), "error");
      }
    }
  };

  const handleSeeMenu = (bakeryId: number, bakeryName: string) => {
    navigate(`/menu/${bakeryId}`, { state: { bakeryName } });
  };

  const handleGoToAdd = () => {
    notify(
      t("add_bakery_hint_map") || "Please use the map to add a bakery!",
      "info"
    );
    navigate("/home-map");
  };

  const handleEditClick = (bakery: BakeryDto) => {
    setEditingBakery(bakery);
    setIsModalOpen(true);
  };

  const handleSaveBakery = async (id: number, data: BakeryDto) => {
    try {
      await updateBakery({ id, data }).unwrap();
      notify(t("bakery_updated_success") || "Bakery updated!", "success");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      notify(t("error_generic"), "error");
    }
  };

  return (
    <div className="bakery-list-page">
      <Toaster position="top-center" />

      <div className="bakery-list-content">
        <div className="list-header-modern">
          <div className="header-text">
            <h1 className="page-title">{t("bakeries_list")}</h1>
            <p className="page-subtitle">Manage your locations & menus</p>
          </div>

          <div className="header-actions">
            <button
              className="action-btn-modern back"
              onClick={() => navigate("/home-map")}
            >
              <ArrowLeft size={18} />
              <span>{t("back_to_map")}</span>
            </button>
          </div>
        </div>

        {isLoading && <div className="loading-spinner"></div>}
        {error && <p className="error-text">{t("error_generic")}</p>}

        <div className="bakeries-grid">
          {bakeries.map((bakery) => (
            <div key={bakery.id} className="bakery-card">
              <div className="bakery-avatar-section">
                <div className="bakery-avatar-circle">
                  <Store size={28} color="#5d4037" />
                </div>
              </div>

              <div className="bakery-info-section">
                <h3 className="bakery-name">{bakery.name}</h3>
                <div className="bakery-city-badge">
                  <MapPin size={12} style={{ marginRight: 4 }} />
                  {bakery.city || "Cluj-Napoca"}
                </div>
                <p className="bakery-address">{bakery.address}</p>
              </div>

              <div className="bakery-actions">
                <button
                  className="card-action-btn menu-btn"
                  onClick={() => handleSeeMenu(bakery.id!, bakery.name)}
                  title={t("see_menu")}
                >
                  <UtensilsCrossed size={18} />
                </button>

                <button
                  className="card-action-btn edit-btn"
                  onClick={() => handleEditClick(bakery)}
                  title={t("edit")}
                >
                  <Edit2 size={18} />
                </button>

                <button
                  className="card-action-btn delete-btn"
                  onClick={() => handleDelete(bakery.id!)}
                  title={t("delete")}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EditBakeryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bakery={editingBakery}
        onSave={handleSaveBakery}
      />
    </div>
  );
};
