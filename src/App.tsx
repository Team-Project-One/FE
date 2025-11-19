import React, { useEffect, useState } from 'react';
import './theme/global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, TextInput } from 'react-native';
import { useFonts, Arimo_400Regular, Arimo_700Bold } from '@expo-google-fonts/arimo';

import MainScreen from './screen/MainScreen';
import SignupLandingScreen from './screen/SignupLandingScreen';
import SignupLoginScreen from './screen/SignupLoginScreen';
import SignupBasicScreen from './screen/SignupBasicScreen';
import SignupDetailedScreen from './screen/SignupDetailedScreen';
import SignupSelfIntroScreen from './screen/SignupSelfIntroScreen';
import SignupProfileScreen from './screen/SignupProfileScreen';
import MyScreen from './screen/MyScreen';
import ChatScreen from './screen/ChatScreen';
import ChatDetailScreen from './screen/ChatDetailScreen';
import MatchingResultScreen from './screen/MatchingResultScreen';
import SettingsScreen from './screen/SettingsScreen';
import ProfileEditScreen from './screen/ProfileEditScreen';
import TermsScreen from './screen/TermsScreen';
import PrivacyScreen from './screen/PrivacyScreen';

import { Screen, NavigationHandler } from './types';
import { ThemeProvider } from './theme/ThemeContext';
import { SignupProvider } from './context/SignupContext';

interface AppState {
    currentScreen: Screen;
    routeParams?: any;
    chatDetailName?: string;
    chatDetailAge?: number;
}

const App: React.FC = () => {
    const [fontsLoaded] = useFonts({ Arimo_400Regular, Arimo_700Bold });
    const [appState, setAppState] = useState<AppState>({
        currentScreen: 'signupLanding',
        routeParams: {},
    });

    useEffect(() => {
        if (fontsLoaded) {
            Text.defaultProps = Text.defaultProps || {};
            Text.defaultProps.style = [Text.defaultProps.style, { fontFamily: 'Arimo_400Regular' }];

            TextInput.defaultProps = TextInput.defaultProps || {};
            TextInput.defaultProps.style = [TextInput.defaultProps.style, { fontFamily: 'Arimo_400Regular' }];
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    const handleNavigation: NavigationHandler = (screen, extraData?: any) => {
        console.log("handleNavigation 호출:", { screen, extraData, currentScreen: appState.currentScreen });
        if (screen === 'chatDetail' && extraData) {
            setAppState({
                currentScreen: 'chatDetail',
                chatDetailName: extraData.chatName,
                chatDetailAge: extraData.chatAge,
                routeParams: {},
            });
        } else {
            setAppState({
                currentScreen: screen,
                routeParams: extraData || {},
            });
        }
        console.log("handleNavigation 완료:", screen);
    };

    const renderScreen = () => {
        const params = appState.routeParams || {};

        switch (appState.currentScreen) {
            case 'signupLanding':
                return <SignupLandingScreen onNavigate={handleNavigation} routeParams={params} />;
            case 'signupLogin':
                return <SignupLoginScreen onNavigate={handleNavigation} routeParams={params} />;
            case 'signupBasic':
                return <SignupBasicScreen onNavigate={handleNavigation} routeParams={params} />;
            case 'signupDetailed':
                return <SignupDetailedScreen onNavigate={handleNavigation} routeParams={params} />;
            case 'signupSelfIntro':
                return <SignupSelfIntroScreen onNavigate={handleNavigation} routeParams={params} />;
            case 'signupProfile':
                return <SignupProfileScreen onNavigate={handleNavigation} routeParams={params} />;
            case 'home':
            case 'main':
                return <MainScreen onNavigate={handleNavigation} />;
            case 'mypage':
                return <MyScreen onNavigate={handleNavigation} />;
            case 'chat':
                return <ChatScreen onNavigate={handleNavigation} />;
            case 'chatDetail':
                return (
                    <ChatDetailScreen
                        onNavigate={handleNavigation}
                        chatName={appState.chatDetailName}
                        chatAge={appState.chatDetailAge}
                    />
                );
            case 'matchingResult':
                return <MatchingResultScreen onNavigate={handleNavigation} />;
            case 'settings':
                return <SettingsScreen onNavigate={handleNavigation} />;
            case 'profileEdit':
                return <ProfileEditScreen onNavigate={handleNavigation} />;
            case 'terms':
                return <TermsScreen onNavigate={handleNavigation} />;
            case 'privacy':
                return <PrivacyScreen onNavigate={handleNavigation} />;
            default:
                return <SignupLandingScreen onNavigate={handleNavigation} />;
        }
    };

    return (
        <ThemeProvider>
            <SignupProvider>
                <SafeAreaProvider>{renderScreen()}</SafeAreaProvider>
            </SignupProvider>
        </ThemeProvider>
    );
};

export default App;
