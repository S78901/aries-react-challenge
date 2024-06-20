import { useState, useEffect } from 'react';
import './options.css';

function OptionsProfitCalculator(data) {

    useEffect(() => {
        console.log(data);
    }, [data])

    return (
        <div className='wrap-options-calc'>
            <div className='wrap-options-flex-col'>
                <div className='wrap-options-flex-row center-row'>
                    <h1>Options Profit Calculator</h1>
                </div>
                <div className='wrap-options-flex-row'>
                    <div>Graph</div>
                </div>
            </div>
        </div>
    );
}

export default OptionsProfitCalculator;