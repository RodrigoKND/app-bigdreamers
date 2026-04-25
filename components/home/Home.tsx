import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Activity } from '@/types';
import { Colors } from '@/constants/colors';
import { getCurrentUser } from '@/services/userService';
import { getRecentActivities } from '@/services/communityService';
import Header from '@/components/home/Header';
import UserProfileCard from '@/components/home/UserProfileCard';
import StatCard from '@/components/home/StatCard';
import CourseCard from '@/components/home/CourseCard';
import ActivitySection from '@/components/home/ActivitySection';
import ActivityItem from '@/components/home/ActivityItem';


export default function HomeScreen() {
    const [user, setUser] = useState<User | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const [u, a] = await Promise.all([getCurrentUser(), getRecentActivities(4)]);
            setUser(u);
            setActivities(a);
            setLoading(false);
        }
        load();
    }, []);

    if (loading || !user) {
        return (
            <View className="flex-1 items-center justify-center bg-navy-900">
                <ActivityIndicator size="large" color={Colors.gold[500]} />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-blue-primary" edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

                <Header points={15} />

                <UserProfileCard user={user} />

                <View className="flex-row px-3 mt-4">
                    <StatCard label="Gemas" value={user.gems.toLocaleString()} />
                    <StatCard label="Módulos" value={user.modules?.toLocaleString() ?? '1'} />
                    <StatCard label="Ranking" value={`#${user.ranking}`} />
                </View>

                <View className="mt-8">
                    <View className="flex-row justify-between px-4 mb-3">
                        <Text className="text-lg font-bold dark:text-white text-black">Continuar aprendiendo</Text>
                        <Text className="text-gray-500 dark:text-white text-sm">Ver todo →</Text>
                    </View>
                    <CourseCard
                        title="Inversiones Básicas"
                        lesson="Lección 4 - Fondos de inversión"
                    />
                </View>

                <ActivitySection>
                    {activities.map((item) => (
                        <ActivityItem key={item.id} activity={item} />
                    ))}
                </ActivitySection>

            </ScrollView>
        </SafeAreaView>
    );
}