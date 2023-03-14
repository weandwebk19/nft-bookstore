export type ListItemType = "button" | "link" | "dropdown" | "divider";

export type ListItemProps = {
  type: ListItemType;
  icon?: JSX.Element | string | null;
  content?: string;
  value?: string;
  onClick?: (a: any) => void;
  disabled?: boolean;
  subList: ListDropdownItemProps[];
  isOpen?: boolean;
  href?: string;
};

export type ListDropdownItemProps = {
  selected: { currentState: string; isOpen: boolean };
} & ListItemProps;

export type ListProps = {
  items?: ListItemProps[];
  size?: number;
};
