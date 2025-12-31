import {FC} from "react";

interface IconClockProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
}

const IconClock: FC<IconClockProps> = ({className}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={className}
      >
        <g
          fill="none"
          stroke="#f28966"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0" />
          <path d="M12 7v5l3 3" />
        </g>
      </svg>
    </>
  );
};

export default IconClock;
