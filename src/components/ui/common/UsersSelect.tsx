import {
  Avatar,
  Box,
  Grow,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  Paper,
  Tooltip,
  Typography
} from "@mui/material";

// import Grow from "@mui/material/Grow";
import CancelIcon from "@mui/icons-material/Cancel";

import { useTranslation } from "next-i18next";

import { useComponentVisible } from "@/components/hooks/common";
import { truncate } from "@/utils/truncate";

interface UsersSelectProps {
  data?: any[] | null;
  itemValue?: string; // for sending requests
  itemName?: string; // for UI
  itemSubname?: string; // for UI
  selectedItem?: any;
  onSelectClick: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: any
  ) => void;
  onInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onResetClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  inputValue: string;
}

const UsersSelect = ({
  data,
  itemValue = "value",
  itemName = "name",
  itemSubname = "subname",
  selectedItem,
  onSelectClick,
  onInputChange,
  onResetClick,
  inputValue
}: UsersSelectProps) => {
  const { t } = useTranslation("common");

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  return (
    <Box ref={ref} sx={{ position: "relative", width: "100%" }}>
      <OutlinedInput
        onChange={onInputChange}
        onClick={() => setIsComponentVisible(true)}
        sx={{ width: "100%" }}
        defaultValue={0}
        value={inputValue}
        endAdornment={
          inputValue && (
            <Tooltip title="Clear">
              <IconButton onClick={(e) => onResetClick(e)}>
                <CancelIcon fontSize="small" color="inherit" />
              </IconButton>
            </Tooltip>
          )
        }
      />
      {isComponentVisible && (
        <Grow in={isComponentVisible}>
          <Paper
            sx={{
              width: "100%",
              position: "absolute",
              maxHeight: 300,
              zIndex: 999,
              overflowY: "scroll"
            }}
          >
            <List>
              {data &&
                data?.length > 0 &&
                data?.map((item, i) => {
                  return (
                    <ListItem key={item?._id || i}>
                      <ListItemButton
                        selected={selectedItem?._id === item?._id}
                        onClick={(e) => {
                          onSelectClick(e, item);
                        }}
                      >
                        <ListItemAvatar>
                          {/* <Avatar alt={item?.[itemValue]} src={item?.avatar} /> */}
                          <Avatar
                            alt={item?.[itemValue]}
                            src={item?.picture?.secureUrl}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          id={item?.[itemName]}
                          primary={
                            <Typography variant="label">
                              {item?.[itemName]}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              className="text-limit text-limit--1"
                            >
                              {truncate(item?.[itemSubname], 6, -4)}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              {data && data?.length <= 0 && (
                <ListItem>
                  <ListItemButton selected={true} disabled={true}>
                    <ListItemText
                      primary={
                        <Typography variant="label">
                          {t("dataNotFound") as string}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </List>
          </Paper>
        </Grow>
      )}
    </Box>
  );
};

export default UsersSelect;
