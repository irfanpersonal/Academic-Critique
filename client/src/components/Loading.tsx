import {FaBook} from "react-icons/fa";

interface LoadingProps {
    title: string;
    position: 'normal' | 'center';
    marginTop?: string;
}

const Loading: React.FunctionComponent<LoadingProps> = ({title, position, marginTop}) => {
    return (
        <div className={`flex flex-col items-center h-screen ${position === 'center' ? 'justify-center' : 'justify-start'}`} style={{marginTop: marginTop}}>
            <div className="loading flex justify-center items-center rounded-full w-15 h-15 animate-spin bg-white shadow-lg">
                <FaBook className="text-black text-2xl"/>
            </div>
            <h1 className="mt-4 text-xl text-gray-800">{title}</h1>
        </div>
    );
};

export default Loading;