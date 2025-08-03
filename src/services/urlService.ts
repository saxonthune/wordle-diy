
import { GameSettings } from '@/types/GameSettings';

export interface UrlService {
    btoaUrlSafe: (input: string) => string;
    atobUrlSafe: (input: string) => string;
    encodeGameSettings: (gameSettings: GameSettings) => string;
    decodeGameSettings: (encodedData: string) => GameSettings;
}

// Version 1: Optimized format with fixed-width fields first, then variable content
// Format: [version(1)][par(1)][difficulty(1)][descriptor(2)][useDict(1)]solution[|author[,guesses]]
// - Fixed header: 6 characters
// - Solution: immediately follows header, always present
// - Author: optional, preceded by pipe
// - Guesses: optional, follow author with commas

export const urlService: UrlService = {
    btoaUrlSafe(input: string): string {
        return btoa(input)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    },

    atobUrlSafe(input: string): string {
        const base64 = input
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
        return atob(base64 + padding);
    },

    encodeGameSettings(gameSettings: GameSettings): string {
        // Validate that no special characters are present that would break the format
        const checkForSpecialChars = (value: string, fieldName: string) => {
            if (value.includes('|')) {
                throw new Error(`Invalid character '|' found in ${fieldName}: "${value}"`);
            }
            if (value.includes(',')) {
                throw new Error(`Invalid character ',' found in ${fieldName}: "${value}"`);
            }
        };

        // Check all fields for special characters
        checkForSpecialChars(gameSettings.solution, 'solution');
        checkForSpecialChars(gameSettings.author, 'author');
        gameSettings.guesses.forEach((guess, index) => {
            checkForSpecialChars(guess, `guess[${index}]`);
        });

        // Fixed-width header: [version(1)][par(1)][difficulty(1)][descriptor(2)][useDict(1)]
        let header = '';
        
        // Version (1 character, major version only)
        const versionMajor = gameSettings.version.split('.')[0] || '1';
        header += versionMajor.charAt(0);
        
        // Par (1 hex character, 0-F = 0-15)
        const parHex = Math.min(15, gameSettings.par).toString(16).toUpperCase();
        header += parHex;
        
        // Difficulty (1 character, 0-2)
        header += gameSettings.difficulty.toString();
        
        // Descriptor (2 characters, padded with leading zeros)
        const descriptorCode = gameSettings.descriptor || '';
        header += ('00' + descriptorCode).slice(-2);
        
        // UseDictionary (1 character, 1/0)
        header += gameSettings.useDictionary ? '1' : '0';
        
        // Solution
        header += gameSettings.solution;

        // Author and guesses
        if (gameSettings.author || gameSettings.guesses.length > 0) {
            header += '|' + (gameSettings.author || '');
            if (gameSettings.guesses.length > 0) {
                header += ',' + gameSettings.guesses.join(',');
            }
        }
        console.log('Encoded game settings:', header);

        return this.btoaUrlSafe(header);
    },

    decodeGameSettings(encodedData: string): GameSettings {
        const decoded = this.atobUrlSafe(encodedData);
        
        // Check minimum length for fixed header
        if (decoded.length < 6) { // 6 chars minimum for header
            throw new Error(`Invalid format: too short (${decoded.length} chars)`);
        }
        
        // Parse fixed-width header
        const version = decoded.charAt(0);
        const par = parseInt(decoded.charAt(1), 16); // hex to decimal
        const difficulty = parseInt(decoded.charAt(2), 10);
        const descriptorCode = decoded.substring(3, 5).replace(/^0+/, ''); // remove leading zeros
        const useDictionary = decoded.charAt(5) === '1';
        
        // Get everything after the header
        const remainder = decoded.substring(6);
        
        // Find pipe separator (if present, separates solution from author+guesses)
        
        let solution: string;
        let author = '';
        let guesses: string[] = [];
        
        const pipeIndex = remainder.indexOf('|');
        if (pipeIndex === -1) {
            solution = remainder;
        } else {
            // Pipe found, extract solution and author+guesses
            solution = remainder.substring(0, pipeIndex);
            const authorAndGuesses = remainder.substring(pipeIndex + 1);
            
            // Parse author and guesses
            const commaIndex = authorAndGuesses.indexOf(',');
            if (commaIndex === -1) {
                // No comma found, only author
                author = authorAndGuesses;
            } else {
                // Comma found, split author and guesses
                author = authorAndGuesses.substring(0, commaIndex);
                const guessesStr = authorAndGuesses.substring(commaIndex + 1);
                guesses = guessesStr ? guessesStr.split(',').filter(g => g.length > 0) : [];
            }
        }
        
        if (version === "1") {
            return {
                solution,
                guesses,
                par,
                difficulty,
                version: "1.0",
                author,
                descriptor: descriptorCode,
                useDictionary
            };
        }
        
        // For future versions, add additional decoding logic here
        throw new Error(`Unsupported version: ${version}`);
    }
}