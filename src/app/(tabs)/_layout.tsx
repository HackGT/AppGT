import { Redirect, Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';

export default function TabsLayout() {
  const theme = useTheme();
  const { showLogin, loading, user } = useAuth();

  if (!loading && showLogin) {
    return <Redirect href="/login" />;
  }
  const showCheckin = user?.roles?.member === true;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.tintColor as string,
        tabBarInactiveTintColor: theme.textSecondary as string,
        tabBarStyle: { backgroundColor: theme.tabBarBackground as string },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => <FontAwesome5 name="calendar" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="information"
        options={{
          title: 'Info',
          tabBarIcon: ({ color }) => <FontAwesome5 name="info-circle" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="interactions"
        options={{
          title: 'Interactions',
          href: showCheckin ? undefined : null,
          tabBarIcon: ({ color }) => <FontAwesome5 name="clipboard-check" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          href: showCheckin ? undefined : null,
          tabBarIcon: ({ color }) => <FontAwesome5 name="shopping-bag" size={22} color={color} />,
        }}
      />
      {/* Swag tab is hidden: checkout now lives in the Scan tab. Remove with its files once verified. */}
      <Tabs.Screen
        name="swag"
        options={{
          title: 'Swag',
          href: null,
          tabBarIcon: ({ color }) => <FontAwesome5 name="shopping-bag" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="check-in"
        options={{
          title: 'Check-In',
          href: showCheckin ? undefined : null,
          tabBarIcon: ({ color }) => <FontAwesome5 name="id-badge" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-circle" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
