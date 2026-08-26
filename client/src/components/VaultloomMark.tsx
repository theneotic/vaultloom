type VaultloomMarkProps = {
  className?: string;
  label?: string;
};

/** A CSS-rendered brand mark that remains available even when external image storage is unavailable. */
export default function VaultloomMark({ className = "", label }: VaultloomMarkProps) {
  return (
    <span aria-label={label} aria-hidden={label ? undefined : true} className={`cipher-vaultloom-mark ${className}`} role={label ? "img" : undefined}>
      <span /><span /><span />
    </span>
  );
}
