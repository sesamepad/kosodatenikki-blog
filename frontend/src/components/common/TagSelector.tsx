import Select from "react-select";

type OptionType = {
  value: string;
  label: string;
};

type Props = {
  options: OptionType[];
  selectedTags: OptionType[];
  setSelectedTags: (tags: OptionType[]) => void;
};

export const TagSelector = ({
  options,
  selectedTags,
  setSelectedTags,
}: Props) => {
  return (
    <div className="tag-selector">
      <Select
        isMulti
        options={options}
        value={selectedTags}
        onChange={(selected) => setSelectedTags(selected as OptionType[])}
        classNamePrefix="react-select"
        placeholder="タグを選択..."
      />
    </div>
  );
};
