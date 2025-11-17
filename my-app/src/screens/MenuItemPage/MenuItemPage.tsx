import React, { useState } from "react";
import "./MenuItemPage.css";
import { ArrowLeft, Search } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MenuItemDto } from "../../entities/menuItem/MenuItemDto";
import { useGetMenuItemsByBakeryIdQuery } from "../../apis/menuItemQueryApi";
import { MenuItemCard } from "../../components/MenuItemCard/MenuItemCard";

export const MenuPage: React.FC = () => {
  const { bakeryId } = useParams<{ bakeryId: string }>();
  const parsedBakeryId = bakeryId ? parseInt(bakeryId, 10) : undefined;
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
          <p>The bakery wasn't selected.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="menu-page">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading menu items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-page">
        <div className="error-container">
          <p>Error loading menu items. Please try again later.</p>
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
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="menu-title">
            {bakeryName ? `${bakeryName}'s Menu` : "Our Menu"}
          </h1>
          <p className="menu-subtitle">
            Discover our delicious selection of cakes
          </p>
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, ingredients, or flavour..."
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
            <p>No menu items found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};
