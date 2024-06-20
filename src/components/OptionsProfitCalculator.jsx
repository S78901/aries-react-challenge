import React, { useState, useEffect } from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { isArrPresent } from './../utils/functions';
import './options.css';

function OptionsProfitCalculator({ data }) {
    const [chartData, setChartData] = useState([]);
    const [haveData, setHaveData] = useState(false);
    const [maxProfits, setMaxProfits] = useState([]);
    const [maxLosses, setMaxLosses] = useState([]);
    const [breakEvenPoints, setBreakEvenPoints] = useState([]);

    useEffect(() => {
        if (isArrPresent(data)) {
            const newChartData = data.map(option => {
                const strikePrice = option.strike_price;
                const longShort = option.long_short.toLowerCase();
                const bid = option.bid;
                const ask = option.ask;
                const type = option.type.toLowerCase();

                const dataPoints = calculateDataPoints(strikePrice, type, longShort, bid, ask);

                let maxProfit, maxLoss, breakEvenPoint;

                if (type === 'call') {
                    if (longShort === 'long') {
                        maxProfit = strikePrice - ask;
                        maxLoss = ask;
                        breakEvenPoint = strikePrice - ask;
                    } else if (longShort === 'short') {
                        maxProfit = ask;
                        maxLoss = strikePrice - ask;
                        breakEvenPoint = strikePrice + ask;
                    }
                } else if (type === 'put') {
                    if (longShort === 'long') {
                        maxProfit = ask;
                        maxLoss = strikePrice - ask;
                        breakEvenPoint = strikePrice - ask;
                    } else if (longShort === 'short') {
                        maxProfit = ask;
                        maxLoss = strikePrice - ask;
                        breakEvenPoint = strikePrice + ask;
                    }
                }

                setMaxProfits(prev => [...prev, maxProfit]);
                setMaxLosses(prev => [...prev, maxLoss]);
                setBreakEvenPoints(prev => [...prev, breakEvenPoint]);

                return {
                    strikePrice,
                    type,
                    longShort,
                    bid,
                    ask,
                    dataPoints,
                };
            });

            setChartData(newChartData);
            setHaveData(true);
        }
    }, [data]);

    const calculateDataPoints = (strikePrice, type, longShort, bid, ask) => {
        const dataPoints = [];

        for (let price = strikePrice - 100; price <= strikePrice + 100; price += 1) {
            let profitLoss = 0;

            if (type === 'call' && longShort === 'long') {
                if (price > strikePrice) {
                    profitLoss = (price - strikePrice) - ask;
                } else {
                    profitLoss = -ask;
                }
            } else if (type === 'put' && longShort === 'long') {
                if (price < strikePrice) {
                    profitLoss = (strikePrice - price) - ask;
                } else {
                    profitLoss = -ask;
                }
            } else if (type === 'call' && longShort === 'short') {
                if (price > strikePrice) {
                    profitLoss = -bid;
                } else {
                    profitLoss = bid;
                }
            } else if (type === 'put' && longShort === 'short') {
                if (price < strikePrice) {
                    profitLoss = -bid;
                } else {
                    profitLoss = bid;
                }
            }

            dataPoints.push({ x: price, y: profitLoss });
        }

        return dataPoints;
    };

    return (
        <div className='wrap-options-calc'>
            <div className='wrap-options-flex-col'>
                <div className='wrap-options-flex-row center-row'>
                    <h1>Options Profit Calculator</h1>
                </div>
                <div className='wrap-options-flex-row-inner'>
                    {(isArrPresent(chartData) && haveData) ?
                        chartData.map((option, index) => (
                            <div className='card wrap-options-flex-col' key={index}>
                                <div className='wrap-options-flex-row'>
                                    <span>Strike Price: ${option.strikePrice}</span>
                                </div>
                                <div className='wrap-options-flex-row'>
                                    <span>Bid: ${option.bid}</span>
                                </div>
                                <div className='wrap-options-flex-row'>
                                    <span>Ask: ${option.ask}</span>
                                </div>
                                <div className='wrap-options-flex-row'>
                                    <span className='capitalize'>Type: {option.type}</span>
                                </div>
                                <div className='wrap-options-flex-row'>
                                    <span className='capitalize'>Long/Short: {option.longShort}</span>
                                </div>
                                <div className='wrap-options-flex-row'>
                                    <span>Max Profit: ${maxProfits[index].toFixed(2)}</span>
                                </div>
                                <div className='wrap-options-flex-row'>
                                    <span>Max Loss: ${maxLosses[index].toFixed(2)}</span>
                                </div>
                                <div className='wrap-options-flex-row'>
                                    <span>Break Even Point: ${breakEvenPoints[index].toFixed(2)}</span>
                                </div>
                                <div className='wrap-options-flex-row add-left-margin' data-testid="scatter-chart">
                                    <ScatterChart
                                        width={1500}
                                        height={400}
                                        series={[{ data: option.dataPoints, label: 'Price, Profit or Loss' }]}
                                        xAxis={[{ min: 50 }]}
                                    />
                                </div>
                                <div className='wrap-options-flex-row center-row'>
                                    <span className='adjust-up'>Price</span>
                                    <span className='adjust-up-sideways'>Profit/Loss</span>
                                </div>
                            </div>
                        )) : <p>Loading...</p>}
                </div>
            </div>
        </div>
    );
}

export default OptionsProfitCalculator;
