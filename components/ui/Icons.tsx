import { IconType } from "react-icons";
import { MdOutlineSearch, MdOutlineShoppingBag } from "react-icons/md";
import { ComponentProps } from "react";

export const Icons = {
  search: MdOutlineSearch,
  cart: MdOutlineShoppingBag,
} as const;

export type IconName = keyof typeof Icons;

type IconProps = ComponentProps<IconType> & {
  name: IconName;
};

export default function Icon({ name, ...props }: IconProps) {
  const IconComponent = Icons[name] as IconType;
  
  return <IconComponent {...props} />;
}
