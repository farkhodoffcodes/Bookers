import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, NativeSyntheticEvent, TextInputKeyPressEventData, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { masterData } from '@/helpers/api-function/register/registrFC';
import registerStory from '@/helpers/state_managment/auth/register';
import { RootStackParamList } from '@/type/root';
import { useNavigation } from '@react-navigation/native';
import { authStorage } from "@/constants/storage";
import { useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';


const CheckPinOnCome: React.FC = () => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const [storedOtp, setStoredOtp] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [tokenData, setTokenData] = useState<string | null>('');
    const inputs = useRef<TextInput[]>([]);
    const [code, setCode] = useState<any>('');
    const { role, firstName, lastName, nickname, phoneNumber } = registerStory()

    const { t } = useTranslation();
    const navigation = useNavigation<any>();

    useEffect(() => {
        const getStoredOtp = async () => {
            try {
                const otp = await AsyncStorage.getItem('otp');
                setStoredOtp(otp);
            } catch (error) {
                console.log('Failed to load OTP from storage', error);
            }
        };

        getStoredOtp();
    }, []);

    useFocusEffect(
        useCallback(() => {
            // Reset state when the page is focused or unfocused
            async function handleContinue() {
                try {
                    let parol = await SecureStore.getItemAsync('password')
                    setCode(parol)

                } catch (error) {
                    console.log(error);

                }
            }
            handleContinue()
        }, [])
    );

    useEffect(() => {
        if (tokenData) {
            authStorage(tokenData)
            handleContinue()
        }
    }, [tokenData]);

    const handleChangeText = (text: string, index: number) => {
        if (/^\d*$/.test(text)) {
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);
            if (text && index < 3) {
                inputs.current[index + 1].focus();
            }
        }
    };

    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const isButtonEnabled = otp.every((digit) => digit.length > 0);

    const handleContinue = () => {
        const enteredOtp = otp.join('');
        if (enteredOtp === code) {
            setIsCorrect(true);
            navigation.navigate('(tabs)')
        } else {
            setIsCorrect(false);
            alert('Неверный ПИН код');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.topSection}>
                    <Text style={styles.label}>{'введите свой PIN-код'}</Text>
                    <View style={styles.inputContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                style={[
                                    styles.input,
                                    isCorrect === false && styles.inputError,
                                    isCorrect === true && styles.inputSuccess,
                                ]}
                                value={digit}
                                onChangeText={(text) => handleChangeText(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                ref={(ref) => (inputs.current[index] = ref!)}
                                maxLength={1}
                                keyboardType="numeric"
                            />
                        ))}
                    </View>
                </View>
                <View style={styles.bottomSection}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            { backgroundColor: isButtonEnabled ? '#9C0A35' : '#828282' },
                        ]}
                        onPress={() => {
                            handleContinue()

                        }}
                        disabled={!isButtonEnabled}
                    >
                        <Text style={[
                            styles.buttonText,
                            { color: isButtonEnabled ? '#FFF' : '#FFF' }
                        ]}>
                            {t("Continue")}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#21212E',
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        marginTop: 50,
    },
    topSection: {
        alignItems: 'center',
        marginTop: 50,
    },
    label: {
        color: '#FFFFFF',
        fontSize: 18,
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: '#4B4B64',
        backgroundColor: '#4B4B64',
        borderRadius: 10,
        width: 50,
        height: 50,
        margin: 4,
        textAlign: 'center',
        fontSize: 20,
        color: '#FFFFFF',
    },
    inputError: {
        borderColor: 'red',
    },
    inputSuccess: {
        borderColor: 'green',
    },
    bottomSection: {
        padding: 20,
    },
    button: {
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 100,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
    },
});

export default CheckPinOnCome;