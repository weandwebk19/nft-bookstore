import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import { TreeView } from "@mui/lab";
import nestify from "@utils/nestify";

import { TreeItem } from "../TreeItem";

interface TreeViewControllerProps {
  name: string;
  items: any[] | null;
}

const TreeViewController = ({ items, ...rest }: TreeViewControllerProps) => {
  const { control, setValue } = useFormContext();

  const [nestedItems, setNestedItems] = useState<any[]>([]);

  useEffect(() => {
    if (items !== null) {
      setNestedItems(nestify(items));
    }
  }, [items]);

  return (
    <Controller
      {...rest}
      render={() => (
        <TreeView
          aria-label="book-genres"
          defaultCollapseIcon={<ArrowDropDownIcon />}
          defaultExpandIcon={<ArrowRightIcon />}
          defaultEndIcon={<div style={{ width: 24, backgroundColor: "red" }} />}
          onNodeSelect={(e: React.SyntheticEvent, nodeIds: any) => {
            setValue(rest.name, nodeIds, { shouldValidate: true });
          }}
          sx={{ height: 264, flexGrow: 1, width: "100", overflowY: "auto" }}
        >
          {nestedItems?.map((parentItem) => {
            return (
              <TreeItem
                key={parentItem._id}
                nodeId={parentItem._id}
                labelText={parentItem.name}
              >
                {parentItem?.children.map((childrenItem: any) => {
                  return (
                    <TreeItem
                      key={childrenItem._id}
                      nodeId={childrenItem._id}
                      labelText={childrenItem.name}
                    />
                  );
                })}
              </TreeItem>
            );
          })}
        </TreeView>
      )}
      name={rest.name}
      control={control}
    />
  );
};

export default TreeViewController;
