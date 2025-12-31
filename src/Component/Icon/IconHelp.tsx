import {FC} from "react";

interface IconHelpProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
}

const IconHelp: FC<IconHelpProps> = ({className}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={className}
      >
        <path
          fill="none"
          stroke="#747760"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9.146 9.074a2.998 2.998 0 0 1 5.28-.838A3 3 0 0 1 12 13v1m0 7a9 9 0 1 1 0-18a9 9 0 0 1 0 18m.05-4v.1h-.1V17z"
        />
      </svg>
    </>
  );
};

export default IconHelp;
