import { IconProps } from "./icons";

export function IconEmptyTable({size = "1em"}: IconProps) {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-grid-2x2-x"
    viewBox="0 0 24 24"
  >
    <path d="M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3M16 16l5 5M16 21l5-5" />
  </svg>
}