import '@testing-library/jest-native/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

describe('Button', () => {
  it('renders title text', () => {
    const { getByText } = render(
      <Button title="Press me" onPress={() => {}} />
    );
    expect(getByText('Press me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Tap" onPress={onPress} />
    );

    fireEvent.press(getByText('Tap'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Disabled" onPress={onPress} disabled />
    );

    fireEvent.press(getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Loading" onPress={onPress} isLoading />
    );

    fireEvent.press(getByText('Loading'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders with different variants without crashing', () => {
    const variants = ['primary', 'secondary', 'ghost', 'light'] as const;

    for (const variant of variants) {
      const { getByText, unmount } = render(
        <Button title={variant} onPress={() => {}} variant={variant} />
      );
      expect(getByText(variant)).toBeTruthy();
      unmount();
    }
  });

  it('renders with different sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    for (const size of sizes) {
      const { getByText, unmount } = render(
        <Button title={size} onPress={() => {}} size={size} />
      );
      expect(getByText(size)).toBeTruthy();
      unmount();
    }
  });
});
