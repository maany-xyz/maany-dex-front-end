import { observer } from "mobx-react-lite";
import React, { type PropsWithChildren } from "react";

import {
  MainLayoutMenu,
  MainMenu,
  SideBarMenuLink,
} from "~/components/main-menu";
import { MaanyNavbar } from "~/components/navbar/maany-navbar";
import { NavbarOsmoPrice } from "~/components/navbar-osmo-price";
import { NavbarOsmosisUpdate } from "~/components/navbar-osmosis-update";
import { Button } from "~/components/ui/button";
import { useCurrentLanguage, useWindowSize } from "~/hooks";
import { AssetVariantsConversionModal } from "~/modals/variants-conversion";

export const MainLayout = observer(
  ({
    children,
    menus,
    secondaryMenuItems,
  }: PropsWithChildren<{
    menus: MainLayoutMenu[];
    secondaryMenuItems: MainLayoutMenu[];
  }>) => {
    useCurrentLanguage();

    const { isMobile } = useWindowSize();

    return (
      <React.Fragment>
        <div className={"bg-osmoverse-400"}>
          {/*Navbar*/}
          <div className={"bg-osmoverse-400 px-2 py-[10px] h-[72px] z-[91]"}>
            <div className="rounded-full overflow-hidden w-[98vw]">
              {/* Original Osmosis NavBar*/}
              {/*<NavBar*/}
              {/*  className="ml:0"*/}
              {/*  menus={menus}*/}
              {/*  secondaryMenuItems={secondaryMenuItems}*/}
              {/*/>*/}
              <MaanyNavbar />
            </div>
          </div>
          <div className={"flex h-[calc(100vh-72px)] md:h-[calc(100vh-64px)]"}>
            {/*Sidebar*/}
            <div className="inset-y-0 z-40 flex w-sidebar flex-col overflow-y-auto overflow-x-hidden bg-osmoverse-400 px-2 md:hidden">
              <div
                className={
                  "bg-osmoverse-900 px-2 pb-2 pt-4 rounded-2xl mb-2 h-full w-full"
                }
              >
                {!isMobile && (
                  <div
                    className="z-50 mx-auto grow-0 MaanyLight"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      className={
                        "center align-middle center-x content-center self-center text-osmoverse-400"
                      }
                    >
                      Console Sidebar
                    </span>
                  </div>
                )}
                <MainMenu
                  className={"mt-4 px-0"}
                  menus={menus}
                  secondaryMenuItems={secondaryMenuItems}
                  ItemComponent={SideBarMenuLink}
                />
                <div className="flex flex-col" />
                <div className="flex flex-1 flex-col justify-end gap-5">
                  <div className="px-2">
                    <NavbarOsmosisUpdate />
                  </div>
                  <NavbarOsmoPrice />
                </div>
                <Button title={"Connect Wallet"} className="w-full mt-2">
                  <span className={"MH7"}>Connect Wallet</span>
                </Button>
              </div>
            </div>

            {/*Content*/}
            <div className="ml-0 rounded-2xl flex flex-col flex-1 overflow-y-scroll bg-osmoverse-900 mr-2 mb-2">
              {children}
            </div>
          </div>
        </div>
        <AssetVariantsConversionModal />
      </React.Fragment>
    );
  }
);
