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

import formatBytes from "@/utils/formatBytes";

interface UploadFieldProps {
  onChange: any;
  onBlur: any;
  uploaded?: File[];
  multiple?: boolean;
  error?: boolean;
  helperText?: string;
  desc?: string;
}

const UploadField = ({
  onChange,
  onBlur,
  multiple = false,
  error,
  uploaded,
  helperText,
  desc
}: UploadFieldProps) => {
  const theme = useTheme();

  return (
    <Dropzone multiple={multiple} onDrop={onChange}>
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
            cursor: "pointer"
          }}
        >
          <Stack
            sx={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
          >
            <CloudUpload />
            <input {...getInputProps()} onBlur={onBlur} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <Stack>
                <p>Drag &apos;n&apos; drop a file here</p>
                <p> or click to select file</p>
              </Stack>
            )}
          </Stack>

          {!error && Number(uploaded?.length) > 0 && (
            <List sx={{ width: "100%" }}>
              {uploaded?.map((f: any, index: number) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <InsertDriveFile />
                  </ListItemIcon>
                  <ListItemText
                    primary={f.name}
                    secondary={formatBytes(f.size)}
                  />
                </ListItem>
              ))}
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
