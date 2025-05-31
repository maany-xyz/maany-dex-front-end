import React from "react";

import { MaanyColors } from "~/styles/theme-config";

export function ExchangeIcon({
  fill = MaanyColors.GRAY_400,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="12"
      viewBox="0 0 20 12"
      fill="none"
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.35156 7.69531C5.35156 8.25781 5.32552 8.72917 5.27344 9.10938L5.39844 9.14062L7.75781 5.5625H9.24219L4.92188 11.5H4.46875L0.140625 5.5625H1.625L3.98438 9.14062L4.11719 9.10938C4.0599 8.69271 4.03125 8.22135 4.03125 7.69531V0.5625H5.35156V7.69531ZM14.4219 4.36719C14.4219 3.84115 14.4505 3.36979 14.5078 2.95312L14.375 2.92188L12.0156 6.5H10.5312L14.8594 0.5625H15.3125L19.6328 6.5H18.1484L15.7891 2.92188L15.6641 2.95312C15.7161 3.32812 15.7422 3.79948 15.7422 4.36719V11.5H14.4219V4.36719Z"
        fill={fill}
      />
    </svg>
  );
}
