import { Popover } from "@headlessui/react";
import { isFunction, runIfFn } from "@osmosis-labs/utils";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FunctionComponent,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useState,
} from "react";

import { Pill } from "~/components/indicators/pill";
import { AmplitudeEvent } from "~/config";
import { useAmplitudeAnalytics, useTranslation, useWindowSize } from "~/hooks";

export type MainLayoutMenu = {
  label: string;
  link: string | MouseEventHandler;
  icon: ReactNode;
  selectionTest?: RegExp;
  amplitudeEvent?: AmplitudeEvent;
  isNew?: Boolean;
  badge?: ReactNode;
  secondaryLogo?: ReactNode;
  subtext?: string;
  showMore?: boolean;
};

export const MainMenu: FunctionComponent<{
  menus: MainLayoutMenu[];
  secondaryMenuItems: MainLayoutMenu[];
  className?: string;
  ItemComponent?: FunctionComponent<MenuLinkProps>;
}> = ({ menus, className, secondaryMenuItems, ItemComponent }) => {
  const LinkComponent = ItemComponent || MenuLink;
  return (
    <ul
      className={classNames(
        "mt-20 flex w-full flex-col gap-3 md:mb-0 md:mt-0 md:gap-0",
        className
      )}
    >
      {menus.map((menu, index) => {
        const { link, selectionTest, secondaryLogo, showMore } = menu;

        return (
          <li
            key={index}
            className="cursor-pointer"
            onClick={(e) => {
              if (isFunction(link)) link(e);
            }}
          >
            <LinkComponent
              href={link}
              secondaryLogo={secondaryLogo}
              selectionTest={selectionTest}
              showMore={showMore}
            >
              {({ showSubTitle, selected }) =>
                showMore ? (
                  <MorePopover
                    item={menu}
                    secondaryMenus={secondaryMenuItems}
                  />
                ) : (
                  <MenuItemContent
                    menu={menu}
                    selected={selected}
                    showSubTitle={showSubTitle}
                  />
                )
              }
            </LinkComponent>
          </li>
        );
      })}
    </ul>
  );
};

type MaybeRenderProp<P> = React.ReactNode | ((props: P) => React.ReactNode);
type MenuLinkProps = {
  href: string | any;
  secondaryLogo?: React.ReactNode;
  children: MaybeRenderProp<{ showSubTitle: boolean; selected: boolean }>;
  selectionTest?: RegExp;
  showMore?: boolean;
};
const MenuLink: FunctionComponent<MenuLinkProps> = ({
  href,
  children,
  secondaryLogo,
  selectionTest,
  showMore,
}) => {
  const router = useRouter();
  const [showSubTitle, setShowSubTitle] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { isMobile } = useWindowSize();

  useEffect(() => {
    setIsMounted(true); // component has mounted. Needed because of NextJS SSR.
  }, []);

  const shouldShowHover = !!secondaryLogo;

  const onClickLink = (e: React.MouseEvent) => {
    // If href is a string, do nothing and let the Link handle the navigation
    if (!isFunction(href)) return;

    e.preventDefault();
    href(e);
  };

  if (isMounted && showMore && isMobile) {
    return null; // Don't render more menu on mobile per discussion with Syed.
  }

  const selected = selectionTest ? selectionTest.test(router.pathname) : false;

  return (
    <Link
      href={typeof href === "string" ? href : "/"}
      passHref
      target={selectionTest ? "_self" : "_blank"}
      className={classNames("flex w-full items-center", {
        "h-12 px-0 py-3 md:py-2": !showMore,
      })}
      onMouseEnter={() => shouldShowHover && setShowSubTitle(true)}
      onMouseLeave={() => shouldShowHover && setShowSubTitle(false)}
      onClick={onClickLink}
    >
      {runIfFn(children, { showSubTitle, selected })}
    </Link>
  );
};

export const SideBarMenuLink: FunctionComponent<MenuLinkProps> = ({
  href,
  children,
  secondaryLogo,
  selectionTest,
  showMore,
}) => {
  const router = useRouter();
  const [showSubTitle, setShowSubTitle] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { isMobile } = useWindowSize();

  useEffect(() => {
    setIsMounted(true); // component has mounted. Needed because of NextJS SSR.
  }, []);

  const shouldShowHover = !!secondaryLogo;

  const onClickLink = (e: React.MouseEvent) => {
    // If href is a string, do nothing and let the Link handle the navigation
    if (!isFunction(href)) return;

    e.preventDefault();
    href(e);
  };

  if (isMounted && showMore && isMobile) {
    return null; // Don't render more menu on mobile per discussion with Syed.
  }

  const selected = selectionTest ? selectionTest.test(router.pathname) : false;

  return (
    <div>
      <Link
        href={typeof href === "string" ? href : "/"}
        passHref
        target={selectionTest ? "_self" : "_blank"}
        className={classNames(
          "flex w-full items-center px-0 h-12 py-3 md:px-3 md:py-2"
        )}
        onMouseEnter={() => shouldShowHover && setShowSubTitle(true)}
        onMouseLeave={() => shouldShowHover && setShowSubTitle(false)}
        onClick={onClickLink}
      >
        {runIfFn(children, { showSubTitle, selected })}
      </Link>
    </div>
  );
};

const MorePopover: FunctionComponent<{
  item: MainLayoutMenu;
  secondaryMenus: MainLayoutMenu[];
}> = ({ item, secondaryMenus }) => {
  return (
    <Popover className="relative flex h-full w-full items-center py-3 px-0">
      {({ open }) => (
        <>
          <Popover.Button className="focus:outline-none">
            <MenuItemContent menu={item} selected={open} />
          </Popover.Button>
          <Popover.Panel className="absolute bottom-full flex w-full flex-col gap-2 rounded-3xl bg-osmoverse-800 py-2 px-0">
            {secondaryMenus.map((menu: MainLayoutMenu) => {
              const { link, selectionTest, secondaryLogo, showMore } = menu;
              return (
                <MenuLink
                  href={link}
                  secondaryLogo={secondaryLogo}
                  selectionTest={selectionTest}
                  showMore={showMore}
                  key={menu.label}
                >
                  <MenuItemContent menu={menu} />
                </MenuLink>
              );
            })}
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

const MenuItemContent: React.FC<{
  selected?: boolean;
  showSubTitle?: boolean;
  menu: MainLayoutMenu;
}> = ({ selected, showSubTitle, menu }) => {
  const { t } = useTranslation();
  const { logEvent } = useAmplitudeAnalytics();

  const { label, icon, amplitudeEvent, isNew, badge, secondaryLogo, subtext } =
    menu;

  return (
    <div
      className={classNames(
        "flex h-7 w-full flex-1 items-center gap-2 transition-all duration-100 ease-in-out md:gap-2 rounded-3xl center px-6 py-6",
        selected
          ? "text-wosmongton-700 border border-wosmongton-700 hover:border-white-high"
          : "text-osmoverse-400 hover:text-white-high"
      )}
      onClick={() => {
        if (amplitudeEvent) {
          logEvent(amplitudeEvent);
        }
      }}
    >
      <div className="relative h-6 w-3">
        {/* Main Icon */}
        <div
          className={classNames(
            "transition-all duration-100 ease-in-out",
            showSubTitle ? "opacity-0" : "opacity-100"
          )}
        >
          {icon}
        </div>
        {/* Secondary Logo */}
        {secondaryLogo && (
          <div
            className={classNames(
              "absolute top-0 left-0 transition-all duration-100 ease-in-out",
              showSubTitle ? "opacity-100" : "opacity-0"
            )}
          >
            {secondaryLogo}
          </div>
        )}
      </div>
      <div
        className={classNames(
          "body2 w-full overflow-hidden overflow-x-hidden transition-all duration-100 ease-in-out"
        )}
      >
        {isNew ? (
          <div className="flex w-full items-center justify-between">
            {label}
            <Pill>
              <span className="button px-2 py-[2px]">{t("menu.new")}</span>
            </Pill>
          </div>
        ) : (
          <>
            <div
              className={classNames(
                "flex w-full place-content-between items-center transition-transform duration-100 ease-in-out",
                { "-translate-y-0.5 transform": showSubTitle && subtext }
              )}
            >
              {label}
              {badge}
            </div>
            {subtext && (
              <div
                className={classNames(
                  "transition-visibility text-white-opacity-70 text-xs font-medium transition-opacity duration-100 ease-in-out",
                  showSubTitle && subtext
                    ? "visible h-5 opacity-100"
                    : "invisible h-0 opacity-0"
                )}
              >
                {subtext}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
