import React from 'react';


export const Container: React.FC = ({children}) => {
    return (
            <div id='container' className='container'>
                {children}
            </div>
    )
};