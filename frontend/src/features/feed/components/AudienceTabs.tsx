//

function classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export type Audience = "recommended" | "following";

export function AudienceTabs({
  value,
  onChange,
}: {
  value: Audience;
  onChange: (v: Audience) => void;
}) {
  return (
    <div
      className="-mx-1 flex items-center justify-center gap-6 border-b bg-background px-1 py-2"
      role="tablist"
      aria-label="Feed audience"
    >
      <button
        type="button"
        onClick={() => onChange("recommended")}
        className={classNames(
          "rounded-full px-3 py-1 text-sm",
          value === "recommended"
            ? "font-semibold underline decoration-2 underline-offset-4"
            : "text-gray-500 hover:text-foreground",
        )}
        role="tab"
        aria-selected={value === "recommended"}
      >
        おすすめ
      </button>
      <button
        type="button"
        onClick={() => onChange("following")}
        className={classNames(
          "rounded-full px-3 py-1 text-sm",
          value === "following"
            ? "font-semibold underline decoration-2 underline-offset-4"
            : "text-gray-500 hover:text-foreground",
        )}
        role="tab"
        aria-selected={value === "following"}
      >
        フォロー中
      </button>
    </div>
  );
}
