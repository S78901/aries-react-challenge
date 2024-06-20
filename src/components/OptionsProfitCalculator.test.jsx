import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import OptionsProfitCalculator from './OptionsProfitCalculator';

const testData = [
    {
        strike_price: 100,
        type: 'Call',
        bid: 10.05,
        ask: 12.04,
        long_short: 'long',
        expiration_date: '2025-12-17T00:00:00Z',
    },
    {
        strike_price: 102.50,
        type: 'Call',
        bid: 12.10,
        ask: 14,
        long_short: 'long',
        expiration_date: '2025-12-17T00:00:00Z',
    },
    {
        strike_price: 103,
        type: 'Put',
        bid: 14,
        ask: 15.50,
        long_short: 'short',
        expiration_date: '2025-12-17T00:00:00Z',
    },
    {
        strike_price: 105,
        type: 'Put',
        bid: 16,
        ask: 18,
        long_short: 'long',
        expiration_date: '2025-12-17T00:00:00Z',
    },
];

describe('OptionsProfitCalculator', () => {
    it('renders loading text when no data is provided', async () => {
        render(<OptionsProfitCalculator data={[]} />);
        const loadingText = await screen.findByText(/Loading.../i);
        expect(loadingText).toBeTruthy(); // Use truthy assertion
    });

    it('renders correct information when data is provided', async () => {
        render(<OptionsProfitCalculator data={testData} />);

        // Wait for loading text to disappear
        await waitFor(() => {
            const loadingText = screen.queryByText(/Loading.../i);
            expect(loadingText).toBeNull();
        });

        // Check if elements appear
        async function waitForElements() {
            for (const option of testData) {
                await waitFor(() => {
                    const strikePriceText = screen.findByText(`Strike Price: $${option.strike_price}`);
                    expect(strikePriceText).toBeTruthy();
                });

                await waitFor(() => {
                    const maxLossText = screen.findByText(`Max Loss: $${option.long_short === 'long' ? option.ask.toFixed(2) : (option.strike_price - option.ask).toFixed(2)}`);
                    expect(maxLossText).toBeTruthy();
                });

                await waitFor(() => {
                    const breakEvenPointText = screen.findByText(`Break Even Point: $${option.long_short === 'long' ? (option.strike_price - option.ask).toFixed(2) : (option.strike_price + option.ask).toFixed(2)}`);
                    expect(breakEvenPointText).toBeTruthy();
                });
            }
        }

        await waitForElements();
    });
});
