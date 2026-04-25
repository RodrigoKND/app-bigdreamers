import React from 'react';
import { Pressable } from 'react-native';
import * as Linking from 'expo-linking';

export default function ButtonSocialMedia({ icon, url }: { icon: React.ReactNode; url: string}) {
    return (
        <Pressable className="border-2 dark:border-blue-light border-blue-bright rounded-md p-2" onPress={() => Linking.openURL(url)}>
            {icon}
        </Pressable>
    );
}