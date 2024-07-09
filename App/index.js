// Filename: index.js
// Combined code from all files

import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

function LanguageSelector({ onSelect }) {
    const [sourceLanguage, setSourceLanguage] = React.useState('');
    const [targetLanguage, setTargetLanguage] = React.useState('');

    const handleSelection = () => {
        if (sourceLanguage && targetLanguage) {
            onSelect({ source: sourceLanguage, target: targetLanguage });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Select your source language:</Text>
            <Picker
                selectedValue={sourceLanguage}
                onValueChange={(itemValue) => setSourceLanguage(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="English" value="en" />
                <Picker.Item label="Spanish" value="es" />
                {/* Add more languages as needed */}
            </Picker>

            <Text style={styles.label}>Select the language you want to learn:</Text>
            <Picker
                selectedValue={targetLanguage}
                onValueChange={(itemValue) => setTargetLanguage(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="French" value="fr" />
                <Picker.Item label="German" value="de" />
                {/* Add more languages as needed */}
            </Picker>
            
            <Button title="Start Learning" onPress={handleSelection} />
        </View>
    );
}

function LearningStep({ languages, step, setStep }) {
    const [loading, setLoading] = React.useState(true);
    const [content, setContent] = React.useState('');

    React.useEffect(() => {
        const fetchLearningContent = async () => {
            setLoading(true);
            try {
                const response = await axios.post('http://apihub.p.appply.xyz:3300/chatgpt', {
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant. Please provide answers for given requests.' },
                        { role: 'user', content: `Provide some learning content for step ${step} for a person whose source language is ${languages.source} and target language is ${languages.target}.` }
                    ],
                    model: 'gpt-4o'
                });
                const resultString = response.data.response;
                setContent(resultString);
            } catch (error) {
                setContent('Failed to load content');
            } finally {
                setLoading(false);
            }
        };

        fetchLearningContent();
    }, [step]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.step}>Step {step}</Text>
            <Text style={styles.content}>{content}</Text>
            <Button
                title="Next Step"
                onPress={() => setStep(step + 1)}
                style={styles.nextButton}
            />
        </ScrollView>
    );
}

export default function App() {
    const [languages, setLanguages] = React.useState({ source: '', target: '' });
    const [step, setStep] = React.useState(0);

    const handleLanguageSelection = (selectedLanguages) => {
        setLanguages(selectedLanguages);
        setStep(1); // Move to the first learning step
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Learn A New Language</Text>
            {step === 0 ? (
                <LanguageSelector onSelect={handleLanguageSelection} />
            ) : (
                <LearningStep languages={languages} step={step} setStep={setStep} />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 20,
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
    },
    step: {
        fontSize: 20,
        marginVertical: 10,
        fontWeight: 'bold',
    },
    content: {
        fontSize: 16,
        marginVertical: 20,
    },
    nextButton: {
        marginTop: 20,
    },
});