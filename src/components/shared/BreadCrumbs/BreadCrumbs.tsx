import * as React from "react";

import {
  Breadcrumbs as MUIBreadcrumbs,
  Link as MUILink,
  Typography
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";

import { useTranslation } from "next-i18next";
import Link from "next/link";

interface BreadCrumbsProps {
  breadCrumbs: any[];
}

export default function BreadCrumbs({ breadCrumbs }: BreadCrumbsProps) {
  const { t } = useTranslation("common");

  return (
    <MUIBreadcrumbs aria-label="breadcrumb" separator="›">
      <MUILink
        component={Link}
        href="/"
        underline="hover"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        {t("breadcrumbs_home")}
      </MUILink>
      {breadCrumbs.map((crumb, i) => {
        if (i === breadCrumbs.length - 1) {
          return (
            <Typography
              key={crumb.href}
              sx={{
                cursor: "default"
              }}
            >
              {crumb.content}
            </Typography>
          );
        }
        return (
          <MUILink
            component={Link}
            key={crumb.href}
            href={crumb.href}
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
          >
            {crumb.icon && crumb.icon}
            {crumb.content}
          </MUILink>
        );
      })}
    </MUIBreadcrumbs>
  );
}
