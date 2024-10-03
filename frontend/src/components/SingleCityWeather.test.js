import React from 'react';
import { render, screen } from '@testing-library/react';
import SingleCityWeather from './SingleCityWeather';

test('renders the weather information', () => {
    render(<SingleCityWeather city="Warsaw" />);
    expect(screen.getByText(/Current Weather in Warsaw/i)).toBeInTheDocument();
});
