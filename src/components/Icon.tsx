import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function Icon({ size = 16, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {props.children}
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </Icon>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 11L11 5M11 5H6M11 5v5" />
    </Icon>
  );
}

export function ArrowDown(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 3v10M4 9l4 4 4-4" />
    </Icon>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M13 8H3M7 4L3 8l4 4" />
    </Icon>
  );
}

export function Check(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 8.5l3.5 3.5L13 4" />
    </Icon>
  );
}

export function Star(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" stroke="none">
      <path d="M8 1l2.2 4.5L15 6.3l-3.5 3.4.8 4.8L8 12.2 3.7 14.5l.8-4.8L1 6.3l4.8-.8z" />
    </Icon>
  );
}

export function Play(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" stroke="none">
      <path d="M4 2.5v11l9-5.5z" />
    </Icon>
  );
}

export function Pause(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" stroke="none">
      <rect x="3" y="2" width="4" height="12" rx="1" />
      <rect x="9" y="2" width="4" height="12" rx="1" />
    </Icon>
  );
}

export function RotateCcw(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2 6h7a4 4 0 1 1 0 8H7" />
      <path d="M5 3L2 6l3 3" />
    </Icon>
  );
}

export function Music(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 4v8" />
      <circle cx="4" cy="12" r="2" fill="currentColor" />
      <path d="M6 4l6-1v8" />
      <circle cx="10" cy="11" r="2" fill="currentColor" />
    </Icon>
  );
}

export function Diamond(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" stroke="none">
      <path d="M8 1l5 7-5 7-5-7z" />
    </Icon>
  );
}

export function Bullet(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" stroke="none">
      <path d="M4 3l8 5-8 5z" />
    </Icon>
  );
}

export function ExternalLink(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 3H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9" />
      <path d="M9 2h5v5M14 2L7 9" />
    </Icon>
  );
}

export function Plus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 3v10M3 8h10" />
    </Icon>
  );
}

export function Trash(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 4h10M6 4V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V4M4.5 4l.8 9.5a1 1 0 0 0 1 .9h3.4a1 1 0 0 0 1-.9L11.5 4" />
    </Icon>
  );
}

export function Download(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 2v9M4 7l4 4 4-4M2 13h12" />
    </Icon>
  );
}

export function Upload(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 11V2M4 6l4-4 4 4M2 13h12" />
    </Icon>
  );
}

export function Copy(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="5" y="5" width="8" height="8" rx="1.5" />
      <path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11" />
    </Icon>
  );
}

export function XMark(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 4l8 8M12 4l-8 8" />
    </Icon>
  );
}

export function Palette(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="5" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="8" cy="4" r="1" fill="currentColor" stroke="none" />
      <circle cx="11" cy="6" r="1" fill="currentColor" stroke="none" />
      <path d="M8 1a7 7 0 1 0 0 14c1.5 0 2-1 2-2 0-.6-.2-1-.2-1.5 0-1 .8-1.5 1.8-1.5H13a2 2 0 0 0 2-2C15 4.5 11.9 1 8 1z" />
    </Icon>
  );
}

export function Sun(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" />
    </Icon>
  );
}

export function Moon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M13.5 9.5A6 6 0 1 1 6.5 2.5a4.5 4.5 0 0 0 7 7z" />
    </Icon>
  );
}

export function Volume2(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 6h3l4-3v10l-4-3H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM13 5a5 5 0 0 1 0 6M14.5 3a7.5 7.5 0 0 1 0 10" />
    </Icon>
  );
}

export function VolumeX(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 6h3l4-3v10l-4-3H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM13 6l4 4M17 6l-4 4" />
    </Icon>
  );
}

export function Sparkles(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5L8 1zM13 12l.75 2.25L16 15l-2.25.75L13 18l-.75-2.25L10 15l2.25-.75L13 12z" />
    </Icon>
  );
}
