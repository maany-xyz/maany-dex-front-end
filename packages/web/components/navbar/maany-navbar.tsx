import classNames from "classnames";
import React, { FunctionComponent } from "react";

import { MaanyLogo } from "~/components/icons/maany";

type Props = {
  className?: string;
};

export const MaanyNavbar: FunctionComponent<Props> = ({ className }) => {
  return (
    <div
      className={classNames(
        "fixed z-[90] bg-osmoverse-900 justify-center rounded-full flex h-navbar w-[99vw] place-content-between items-center px-2 lg:gap-5 md:h-navbar-mobile md:w-full md:place-content-start md:px-2",
        className
      )}
    >
      <MaanyLogo />
    </div>
  );
};
