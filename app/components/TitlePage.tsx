import React from 'react';

interface TitlePageProps {
    title: string;
    span?: string;
}

const TitlePage: React.FC<TitlePageProps> = ({ title, span }) => {
    return (
        <div className='mb-10'>
            <h1 className='text-4xl text-slate-900 font-bold'>{title}</h1>
            {span && <span className='bg-primary-600 text-slate-500 font-light'>{span}</span>}
        </div>
    );
};

export default TitlePage;