export type TagProps = {
    tag: string;
    isSelected: boolean;
    onClick: () => void;
}

export const Tag: React.FC<TagProps> = ({ tag, isSelected, onClick }) => (
    <div
        className={`cursor-pointer mr-2 mb-2 py-1 px-3 rounded-md text-sm shadow-md transition-colors duration-300 ease-in-out ${isSelected ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gradient-to-r from-blue-400 to-purple-500 hover:text-white'}`}
        onClick={onClick}
    >
        {tag}
    </div>
);
