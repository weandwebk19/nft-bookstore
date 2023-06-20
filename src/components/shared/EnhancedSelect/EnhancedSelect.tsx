import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  Paper,
  Typography
} from "@mui/material";

import { useDebounce } from "@hooks/common";

import { useComponentVisible } from "@/components/hooks/common";

interface EnhancedSelectProps {
  data: any[] | null;
  itemValue?: string; // for sending requests
  itemName?: string; // for UI
  itemSubname?: string;
}

const EnhancedSelect = ({
  data,
  itemValue = "value",
  itemName = "name",
  itemSubname = "subname"
}: EnhancedSelectProps) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const [selectedItem, setSelectedItem] = useState<any>();
  const [inputValue, setInputValue] = useState("");
  const [listItems, setListItems] = useState([]);

  const debounced = useDebounce(inputValue, 500);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: any
  ) => {
    event.preventDefault();
    setSelectedItem(item);
  };

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    setSelectedItem({});
  }, [inputValue]);

  useEffect(() => {
    if (!debounced.trim()) {
      setInputValue("");
      return;
    }

    // fetching API here (replace 'inputValue' to 'debounced')
    // const authors = await axios.getAuthors()

    // setListItems(authors);
  }, [debounced]);

  return (
    <Box ref={ref} sx={{ position: "relative", width: "100%" }}>
      <OutlinedInput
        onChange={(e) => handleInputChange(e)}
        onClick={() => setIsComponentVisible(true)}
        sx={{ width: "100%" }}
        defaultValue={0}
        value={selectedItem?.[itemName] || inputValue}
      />
      {isComponentVisible && (
        <Paper
          sx={{
            width: "100%",
            position: "absolute",
            height: 300,
            zIndex: 999,
            overflowY: "scroll"
          }}
        >
          <List>
            <ListItem>
              <ListItemButton
                onClick={(e) => {
                  handleListItemClick(e, 0);
                }}
              >
                <ListItemText primary="All" />
              </ListItemButton>
            </ListItem>
            {data?.map((item, i) => {
              return (
                <ListItem key={item?._id || i}>
                  <ListItemButton
                    selected={selectedItem?._id === item?._id}
                    onClick={(e) => {
                      handleListItemClick(e, item);
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar alt={item?.[itemValue]} src={item?.avatar} />
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
                          {item?.[itemSubname]}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default EnhancedSelect;
