import Dropzone from "react-dropzone";

import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import CloudUpload from "@mui/icons-material/CloudUpload";
import InsertDriveFile from "@mui/icons-material/InsertDriveFile";

import { useTranslation } from "next-i18next";

import formatBytes from "@/utils/formatBytes";

interface UploadFieldProps {
  onChange: any;
  onBlur: any;
  // uploaded?: File[] | File;
  uploaded?: any;
  multiple?: boolean;
  error?: boolean;
  helperText?: string;
  desc?: string;
  disabled?: boolean;
}

const UploadField = ({
  onChange,
  onBlur,
  multiple = false,
  error,
  uploaded,
  helperText,
  desc,
  disabled = false
}: UploadFieldProps) => {
  const { t } = useTranslation("common");
  const theme = useTheme();

  return (
    <Dropzone
      multiple={multiple}
      onDrop={(acceptedFiles: File[]) => {
        if (multiple) {
          onChange(acceptedFiles);
        } else {
          onChange(acceptedFiles[0]);
        }
      }}
      disabled={disabled}
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
        <Box
          {...getRootProps()}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            border: `1px dashed ${theme.palette.primary.light}`,
            backgroundColor: `${theme.palette.background.default}`,
            borderRadius: "5px",
            position: "relative",
            minHeight: "250px",
            height: "100%",
            overflow: "hidden",
            p: 2,
            cursor: disabled ? "default" : "pointer"
          }}
        >
          <Stack
            sx={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <CloudUpload />
            <input {...getInputProps()} onBlur={onBlur} />
            {isDragActive ? (
              <p>{t("dropFileHere") as string}</p>
            ) : (
              <Stack>
                <p>{t("dragAndDrop1") as string}</p>
                <p>{t("dragAndDrop2") as string}</p>
              </Stack>
            )}
          </Stack>

          {!error && multiple && Number(uploaded?.length) > 0 && (
            <List sx={{ width: "100%" }}>
              {uploaded?.map((f: any, index: number) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <InsertDriveFile />
                  </ListItemIcon>
                  <ListItemText
                    primary={f.name}
                    secondary={formatBytes(f.size)}
                    className="text-limit text-limit--1"
                  />
                </ListItem>
              ))}
            </List>
          )}

          {!error && !multiple && uploaded && (
            <List sx={{ width: "100%" }}>
              <ListItem>
                <ListItemIcon>
                  <InsertDriveFile />
                </ListItemIcon>
                <ListItemText
                  primary={uploaded?.name}
                  secondary={formatBytes(uploaded?.size)}
                />
              </ListItem>
            </List>
          )}

          <Typography variant="caption" sx={{ textAlign: "center" }}>
            {desc}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              bottom: 0,
              color: `${theme.palette.error.main}`
            }}
          >
            {helperText}
          </Typography>
        </Box>
      )}
    </Dropzone>
  );
};

export default UploadField;
