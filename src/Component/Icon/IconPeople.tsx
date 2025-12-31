import {FC} from "react";

interface IconPeopleProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
}

const IconPeople: FC<IconPeopleProps> = ({className}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 48 48"
        className={className}
      >
        <rect width="48" height="48" fill="none" />
        <path
          fill="#222221"
          stroke="#222221"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
          d="M24 20a7 7 0 1 0 0-14a7 7 0 0 0 0 14M6 40.8V42h36v-1.2c0-4.48 0-6.72-.872-8.432a8 8 0 0 0-3.496-3.496C35.92 28 33.68 28 29.2 28H18.8c-4.48 0-6.72 0-8.432.872a8 8 0 0 0-3.496 3.496C6 34.08 6 36.32 6 40.8"
        />
      </svg>
    </>
  );
};

export default IconPeople;
