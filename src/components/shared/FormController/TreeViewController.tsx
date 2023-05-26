import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import { TreeView } from "@mui/lab";
import nestify from "@utils/nestify";
import { useRouter } from "next/router";

import { TreeItem } from "../TreeItem";

interface TreeViewControllerProps {
  name: string;
  items: any[] | null;
}

const TreeViewController = ({ items, ...rest }: TreeViewControllerProps) => {
  const { locale } = useRouter();

  const { control, setValue, getValues } = useFormContext();

  const [nestedItems, setNestedItems] = useState<any[]>([]);

  useEffect(() => {
    if (items !== null) {
      setNestedItems(nestify(items));
    }
  }, [items]);

  const handleClickTreeItem = (nodeId: string) => {
    if (typeof rest.name === "string") {
      let oldValue = getValues(rest.name);
      let newValue: Array<string> = [];
      let flag = oldValue?.includes(nodeId) ? true : false;

      const foundItemChildren = items?.find(
        (item) => item._id === nodeId && item?.parent_id
      );

      if (foundItemChildren) {
        let foundNestItem = nestedItems?.find(
          (item) =>
            item._id === foundItemChildren.parent_id &&
            item?.children?.length > 0
        );

        if (flag) {
          newValue = oldValue?.filter((item: string) => item !== nodeId);
          newValue = newValue?.filter(
            (item: string) => item !== foundNestItem._id
          );
        } else {
          newValue = [...oldValue, nodeId];
          const childrenItems = foundNestItem.children.map(
            (item: any) => item._id
          );
          const isAllChildren = childrenItems.filter(
            (item: string) => !newValue.includes(item)
          );

          if (isAllChildren.length === 0) {
            newValue = [...newValue, foundNestItem._id];
          }
        }
      } else {
        let foundNestItem: any = nestedItems?.find(
          (item) => item._id === nodeId && item?.children?.length > 0
        );

        if (foundNestItem) {
          if (flag) {
            newValue = oldValue?.filter((item: string) => item !== nodeId);
            const childrenItems = foundNestItem.children.map(
              (item: any) => item._id
            );
            newValue = newValue.filter(
              (item: string) => !childrenItems.includes(item)
            );
          } else {
            newValue = [...oldValue, nodeId];
            const childrenItems = foundNestItem.children.map(
              (item: any) => item._id
            );
            newValue = newValue.concat(childrenItems);
          }
        } else {
          if (flag) {
            newValue = oldValue?.filter((item: string) => item !== nodeId);
          } else {
            newValue = [...oldValue, nodeId];
          }
        }
      }
      setValue(rest.name, newValue, { shouldValidate: true });
    }
  };

  return (
    <Controller
      {...rest}
      render={() => (
        <TreeView
          aria-label="book-genres"
          defaultCollapseIcon={<ArrowDropDownIcon />}
          defaultExpandIcon={<ArrowRightIcon />}
          defaultEndIcon={<div style={{ width: 24, backgroundColor: "red" }} />}
          sx={{ height: 264, flexGrow: 1, width: "100", overflowY: "auto" }}
          multiSelect={true}
        >
          {nestedItems?.map((parentItem) => {
            return (
              <TreeItem
                key={parentItem._id}
                nodeId={parentItem._id}
                labelText={
                  locale === "en" ? parentItem.name : parentItem.vi_name
                }
                formName={rest.name}
                setValue={setValue}
                getValues={getValues}
                handleClick={handleClickTreeItem}
              >
                {parentItem?.children.map((childrenItem: any) => {
                  return (
                    <TreeItem
                      key={childrenItem._id}
                      nodeId={childrenItem._id}
                      labelText={
                        locale === "en"
                          ? childrenItem.name
                          : childrenItem.vi_name
                      }
                      formName={rest.name}
                      setValue={setValue}
                      getValues={getValues}
                      handleClick={handleClickTreeItem}
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
