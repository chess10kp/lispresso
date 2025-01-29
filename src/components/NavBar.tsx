import Image from "next/image";
import Link from "next/link";

import {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Menubar } from "@/components/ui/menubar";


const NavLink = (props: any) => {
  return (
    <Link {...props} legacyBehavior passHref>
      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
        {props.children}
      </NavigationMenuLink>
    </Link>
  );
};

export const NavBar = () => {
  const navItems = [
    { name: "About ", link: "/about" },
    { name: " Playground", link: "#terminal" },
  ];
  return (
    <Menubar className="m-2 bg-[#f7edd9] flex flex-row justify-between">
      <div>
        <Link href="/" className="list-none font-bold">
          <Image
            className=" logo sm:w-12 md:w-16 lg:w-20"
            alt="logo"
            height={0} // Height auto-scales
            width={100} // Set a reasonable max width
            src="/official_logo.png"
          />
        </Link>
      </div>
      <NavigationMenu className="bg-[#f7edd9]">
        <NavigationMenuList className="bg-[#f7edd9]">
          {navItems.map((item, idx) => (
            <NavigationMenuItem
              className="bg-[#f7edd9] nav-item mx-2"
              key={idx}
            >
              <NavigationMenuLink href={`${item.link}`}>
                {item.name}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </Menubar>
  );
};
