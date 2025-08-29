type LanguageTagProps = {
  isSelected: boolean;
  name: string;
  onClicked: () => void;
};

export const LanguageTag = ({
  isSelected,
  name,
  onClicked,
}: LanguageTagProps) => {
  return (
    <button
      onClick={onClicked}
      className={`px-3 py-1 rounded border transition 
            ${isSelected ? "bg-white text-black" : "bg-black text-white"}`}
    >
      {name}
      {isSelected ? "×" : "+"}
    </button>
  );
};
