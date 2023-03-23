import * as React from "react";

import { Link, Breadcrumbs as MUIBreadcrumbs, Typography } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";

import { useRouter } from "next/router";

interface BreadCrumbsProps {
  breadCrumbs: any[];
}

export default function BreadCrumbs({ breadCrumbs }: BreadCrumbsProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <MUIBreadcrumbs aria-label="breadcrumb" separator="›">
      <Link
        href="/"
        underline="hover"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </Link>
      {breadCrumbs.map((crumb) => {
        if (crumb.href === currentPath) {
          return (
            <Typography key={crumb.href} sx={{ cursor: "default" }}>
              {crumb.content}
            </Typography>
          );
        }
        return (
          <Link
            key={crumb.href}
            href={crumb.href}
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
          >
            {crumb.icon && crumb.icon}
            {crumb.content}
          </Link>
        );
      })}
    </MUIBreadcrumbs>
  );
}
