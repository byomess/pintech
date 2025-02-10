export type TagProps = {
    tag: string;
    isSelected: boolean;
    onClick: () => void;
}

export const Tag: React.FC<TagProps> = ({ tag, isSelected, onClick }) => (
    <div
        className={`cursor-pointer py-1 px-2 rounded-md text-xs shadow-md transition-colors duration-300 ease-in-out ${isSelected ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-card-background text-gray-300 hover:bg-gradient-to-r from-red-500 to-orange-500 hover:text-white'}`}
        onClick={onClick}
    >
        <span>{tag}</span>
    </div>
);
