import React from 'react';
import hero from '../images/hero.png';
import {GlobalSearch} from '../components';
import {FaUniversity, FaUserGraduate, FaBook} from 'react-icons/fa';

const Home: React.FunctionComponent = () => {   
    return (
        <div>
            <GlobalSearch/>
            <div className="p-8">
                <div>
                    <h1 className="text-6xl font-bold text-center">Empower Your Education with Honest Reviews and Insightful Data.</h1>
                    <p className='text-center text-2xl mt-4'>A platform designed to help students make informed decisions about their education by providing detailed reviews and insights into institutions, educators, and courses. Users can browse real student feedback, compare course syllabi, view class sizes, and explore other relevant academic details to better understand the learning environment. Whether you're choosing a new course, evaluating an instructor, or researching schools, Academic Critique gives you the transparency and information you need to navigate your educational journey with confidence.</p>
                </div>
                <div className="mt-4 flex justify-center items-center">
                    <img className="rounded-2xl w-96 h-96 outline" src={hero} alt="A man juggling the core concepts of Academic Critique"/>
                </div>
            </div>
            <h1 className="text-center text-4xl mb-4">Choosing what's right has never been easier!</h1>
            <div className="flex flex-wrap justify-center items-center p-6 rounded-lg bg-gray-100">
                <div className="flex flex-col items-center p-4 rounded-lg w-64 text-center m-4 bg-gray-400 shadow-lg">
                    <div className="text-4xl mb-3 text-blue-600">
                        <FaUniversity/>
                    </div>
                    <h1 className="text-xl font-semibold mb-2 text-gray-800">Institutions</h1>
                    <p className="text-gray-100">Explore detailed reviews and ratings of educational institutions to find the perfect fit for your academic journey.</p>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg w-64 text-center m-4 bg-gray-400 shadow-lg">
                    <div className="text-4xl mb-3 text-green-600">
                        <FaUserGraduate/>
                    </div>
                    <h1 className="text-xl font-semibold mb-2 text-gray-800">Educators</h1>
                    <p className="text-gray-100">Read feedback and insights about educators to make informed decisions about who will guide your learning experience.</p>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg w-64 text-center m-4 bg-gray-400 shadow-lg">
                    <div className="text-4xl mb-3 text-red-600">
                        <FaBook/>
                    </div>
                    <h1 className="text-xl font-semibold mb-2 text-gray-800">Courses</h1>
                    <p className="text-gray-100">Discover comprehensive reviews and course details to choose the classes that best match your academic goals.</p>
                </div>
            </div>
        </div>
    );
}

export default Home;