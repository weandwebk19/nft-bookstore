import { useEffect, useState } from "react";

import {
  Box,
  Collapse,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List as MUIList
} from "@mui/material";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { ListProps } from "@_types/list";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

const List = ({ items, size }: ListProps) => {
  const { pathname } = useRouter();

  const haveSubListItems = items!.filter((item) => item!.type === "dropdown");
  const [openFunctions, setOpenFunctions] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    const toggleState: Record<number, boolean> = {};
    haveSubListItems.map((item) => {
      toggleState[items!.indexOf(item)] = false;
    });
    setOpenFunctions(toggleState);
  }, []);

  const handleToggle = (index: number) => {
    setOpenFunctions({ ...openFunctions, [index]: !openFunctions[index] });
  };

  return (
    <MUIList sx={{ minWidth: `${size}px` }}>
      {items!.map((item, index) => (
        <Box key={`${item?.content} ${index}`}>
          {(() => {
            if (item.type === "dropdown") {
              return (
                <Box>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={
                        item?.onClick ||
                        (() => {
                          handleToggle(index);
                        })
                      }
                      disabled={item?.disabled}
                    >
                      {item?.icon && <ListItemIcon>{item?.icon}</ListItemIcon>}
                      <ListItemText>{item?.content}</ListItemText>
                      {(() => {
                        if (item?.type === "dropdown") {
                          if (openFunctions[index]) return <ExpandLessIcon />;
                          return <ExpandMoreIcon />;
                        }
                      })()}
                    </ListItemButton>
                  </ListItem>
                  {item.subList.map((itemInSubList) => (
                    <Collapse
                      key={itemInSubList.content}
                      in={openFunctions[index] === true}
                      timeout="auto"
                      unmountOnExit
                    >
                      {/* {console.log(
                        "currentState",
                        itemInSubList?.selected?.currentState.toLowerCase()
                      )}
                      {console.log(
                        "value",
                        itemInSubList?.value?.toLowerCase()
                      )} */}
                      <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={itemInSubList?.onClick}
                        selected={
                          itemInSubList?.value?.toLowerCase() ===
                            itemInSubList?.selected?.currentState.toLowerCase() &&
                          itemInSubList?.selected.isOpen
                        }
                        data-value={itemInSubList.value}
                      >
                        <ListItemIcon>{itemInSubList?.icon}</ListItemIcon>
                        <ListItemText>{itemInSubList?.content}</ListItemText>
                      </ListItemButton>
                    </Collapse>
                  ))}
                </Box>
              );
            } else if (item.type === "link") {
              return (
                <ListItem
                  disablePadding
                  className={
                    pathname === item.href
                      ? "active-link active-link--drawer"
                      : ""
                  }
                >
                  <ListItemButton
                    onClick={
                      item?.onClick ||
                      (() => {
                        handleToggle(index);
                      })
                    }
                    disabled={item?.disabled}
                  >
                    {item?.icon && <ListItemIcon>{item?.icon}</ListItemIcon>}
                    <ListItemText>{item?.content}</ListItemText>
                  </ListItemButton>
                </ListItem>
              );
            } else if (item.type === "button") {
              return (
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={
                      item?.onClick ||
                      (() => {
                        handleToggle(index);
                      })
                    }
                    disabled={item?.disabled}
                  >
                    {item?.icon && <ListItemIcon>{item?.icon}</ListItemIcon>}
                    <ListItemText>{item?.content}</ListItemText>
                  </ListItemButton>
                </ListItem>
              );
            } else return <Divider />;
          })()}
        </Box>
      ))}
    </MUIList>
  );
};

List.propTypes = {
  items: PropTypes.array,
  size: PropTypes.number
};

List.defaultProps = {
  items: [],
  size: 300
};

export default List;
