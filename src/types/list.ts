export type ListItemType = "button" | "dropdown" | "divider";

export type ListItemProps = {
  type: ListItemType;
  icon?: JSX.Element | string;
  content: string;
  onClick?: (a: any) => void;
  disabled?: boolean;
  subList: ListDropdownItemProps[];
  isOpen?: boolean;
};

export type ListDropdownItemProps = {
  selected: { currentState: string; isOpen: boolean };
} & ListItemProps;

export type ListProps = {
  items?: ListItemProps[];
  size?: number;
};
