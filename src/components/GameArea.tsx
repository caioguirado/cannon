import React from 'react';


export const GameArea: React.FC = ({children}) => {
    return (
            <div id='gameArea' className='gameArea'>
                {children}
            </div>
    )
};