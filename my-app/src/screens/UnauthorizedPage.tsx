import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5eee1",
      }}
    >
      <Result
        status="403"
        title={t("unauthorized_title")}
        subTitle={t("unauthorized_desc")}
        extra={
          <Button
            type="primary"
            style={{ backgroundColor: "#4e342e" }}
            onClick={() => navigate("/home-map")}
          >
            {t("back_to_map")}
          </Button>
        }
      />
    </div>
  );
};
