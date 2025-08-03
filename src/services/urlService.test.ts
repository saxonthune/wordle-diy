import { urlService } from './urlService';
import { GameSettings } from '@/types/GameSettings';
import { Difficulty } from '@/types/Difficulty';

describe('UrlService', () => {
    describe('btoaUrlSafe', () => {
        it('should encode to URL-safe base64', () => {
            const input = 'hello world';
            const result = urlService.btoaUrlSafe(input);
            // Standard base64 would be: aGVsbG8gd29ybGQ=
            // URL-safe should replace + with -, / with _, and remove padding =
            expect(result).toBe('aGVsbG8gd29ybGQ');
            expect(result).not.toContain('+');
            expect(result).not.toContain('/');
            expect(result).not.toContain('=');
        });

        it('should handle strings that produce + and / in base64', () => {
            const input = '>>?';  // This produces Pj4/ in base64
            const result = urlService.btoaUrlSafe(input);
            expect(result).toBe('Pj4_');
        });
    });

    describe('atobUrlSafe', () => {
        it('should decode URL-safe base64', () => {
            const encoded = 'aGVsbG8gd29ybGQ';
            const result = urlService.atobUrlSafe(encoded);
            expect(result).toBe('hello world');
        });

        it('should handle URL-safe characters', () => {
            const encoded = 'Pj4_';  // URL-safe version of Pj4/
            const result = urlService.atobUrlSafe(encoded);
            expect(result).toBe('>>?');
        });

        it('should add proper padding', () => {
            const encoded = 'YWJj';  // 'abc' without padding
            const result = urlService.atobUrlSafe(encoded);
            expect(result).toBe('abc');
        });
    });

    describe('encodeGameSettings and decodeGameSettings', () => {
        const baseGameSettings: GameSettings = {
            solution: 'HELLO',
            guesses: [],
            par: 6,
            difficulty: Difficulty.Normal,
            version: '1.0',
            author: '',
            descriptor: '',
            useDictionary: true
        };

        describe('basic encoding/decoding', () => {
            it('should encode and decode basic game settings', () => {
                const encoded = urlService.encodeGameSettings(baseGameSettings);
                expect(encoded).toBeTruthy();
                
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded).toEqual(baseGameSettings);
            });

            it('should handle different difficulties', () => {
                const settings = { ...baseGameSettings, difficulty: Difficulty.Hard };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.difficulty).toBe(Difficulty.Hard);
            });

            it('should handle different par values', () => {
                const settings = { ...baseGameSettings, par: 10 };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.par).toBe(10);
            });

            it('should handle maximum par value (15)', () => {
                const settings = { ...baseGameSettings, par: 15 };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.par).toBe(15);
            });

            it('should clamp par values above 15', () => {
                const settings = { ...baseGameSettings, par: 20 };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.par).toBe(15);
            });
        });

        describe('descriptor handling', () => {
            it('should handle empty descriptor', () => {
                const settings = { ...baseGameSettings, descriptor: '' };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.descriptor).toBe('');
            });

            it('should handle single digit descriptor', () => {
                const settings = { ...baseGameSettings, descriptor: '5' };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.descriptor).toBe('5');
            });

            it('should handle two digit descriptor', () => {
                const settings = { ...baseGameSettings, descriptor: '42' };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.descriptor).toBe('42');
            });
        });

        describe('dictionary flag handling', () => {
            it('should handle useDictionary true', () => {
                const settings = { ...baseGameSettings, useDictionary: true };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.useDictionary).toBe(true);
            });

            it('should handle useDictionary false', () => {
                const settings = { ...baseGameSettings, useDictionary: false };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.useDictionary).toBe(false);
            });
        });

        describe('author handling', () => {
            it('should handle empty author', () => {
                const settings = { ...baseGameSettings, author: '' };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.author).toBe('');
            });

            it('should handle author without guesses', () => {
                const settings = { ...baseGameSettings, author: 'TestAuthor' };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.author).toBe('TestAuthor');
                expect(decoded.guesses).toEqual([]);
            });

            it('should handle author with special characters', () => {
                const settings = { ...baseGameSettings, author: 'Test-Author_123' };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.author).toBe('Test-Author_123');
            });
        });

        describe('guesses handling', () => {
            it('should handle empty guesses', () => {
                const settings = { ...baseGameSettings, guesses: [] };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.guesses).toEqual([]);
            });

            it('should handle single guess', () => {
                const settings = { ...baseGameSettings, guesses: ['WORLD'] };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.guesses).toEqual(['WORLD']);
            });

            it('should handle multiple guesses', () => {
                const settings = { ...baseGameSettings, guesses: ['WORLD', 'HOUSE', 'MOUSE'] };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.guesses).toEqual(['WORLD', 'HOUSE', 'MOUSE']);
            });

            it('should handle author with guesses', () => {
                const settings = { 
                    ...baseGameSettings, 
                    author: 'TestAuthor',
                    guesses: ['WORLD', 'HOUSE'] 
                };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.author).toBe('TestAuthor');
                expect(decoded.guesses).toEqual(['WORLD', 'HOUSE']);
            });
        });

        describe('solution handling', () => {
            it('should handle different word lengths', () => {
                const settings = { ...baseGameSettings, solution: 'CAT' };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.solution).toBe('CAT');
            });

            it('should handle longer solutions', () => {
                const settings = { ...baseGameSettings, solution: 'WONDERFUL' };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded.solution).toBe('WONDERFUL');
            });
        });

        describe('complex scenarios', () => {
            it('should handle full game settings with all fields populated', () => {
                const settings: GameSettings = {
                    solution: 'TESTS',
                    guesses: ['HELLO', 'WORLD', 'GAMES'],
                    par: 12,
                    difficulty: Difficulty.NytHard,
                    version: '1.0',
                    author: 'ComplexAuthor',
                    descriptor: '99',
                    useDictionary: false
                };

                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                expect(decoded).toEqual(settings);
            });

            it('should be reversible (encode then decode should match original)', () => {
                const testCases: GameSettings[] = [
                    baseGameSettings,
                    { ...baseGameSettings, difficulty: Difficulty.Hard, par: 3 },
                    { ...baseGameSettings, author: 'Test', guesses: ['GUESS'] },
                    { ...baseGameSettings, descriptor: '7', useDictionary: false },
                ];

                testCases.forEach((settings) => {
                    const encoded = urlService.encodeGameSettings(settings);
                    const decoded = urlService.decodeGameSettings(encoded);
                    expect(decoded).toEqual(settings);
                });
            });
        });

        describe('error handling', () => {
            it('should throw error for too short encoded data', () => {
                expect(() => {
                    urlService.decodeGameSettings(urlService.btoaUrlSafe('12345')); // Only 5 chars
                }).toThrow('Invalid format: too short');
            });

            it('should throw error for unsupported version', () => {
                // Create a manually crafted string with version '2' (unsupported)
                const invalidVersionData = '2' + '6' + '0' + '00' + '1' + 'HELLO';
                const encoded = urlService.btoaUrlSafe(invalidVersionData);
                
                expect(() => {
                    urlService.decodeGameSettings(encoded);
                }).toThrow('Unsupported version: 2');
            });

            it('should handle malformed base64', () => {
                expect(() => {
                    urlService.decodeGameSettings('invalid!@#');
                }).toThrow();
            });

            it('should throw error for pipe character in solution', () => {
                const settings = { ...baseGameSettings, solution: 'HE|LO' };
                expect(() => {
                    urlService.encodeGameSettings(settings);
                }).toThrow("Invalid character '|' found in solution");
            });

            it('should throw error for comma character in solution', () => {
                const settings = { ...baseGameSettings, solution: 'HE,LO' };
                expect(() => {
                    urlService.encodeGameSettings(settings);
                }).toThrow("Invalid character ',' found in solution");
            });

            it('should throw error for pipe character in author', () => {
                const settings = { ...baseGameSettings, author: 'Test|Author' };
                expect(() => {
                    urlService.encodeGameSettings(settings);
                }).toThrow("Invalid character '|' found in author");
            });

            it('should throw error for comma character in author', () => {
                const settings = { ...baseGameSettings, author: 'Last,First' };
                expect(() => {
                    urlService.encodeGameSettings(settings);
                }).toThrow("Invalid character ',' found in author");
            });

            it('should throw error for special characters in guesses', () => {
                const settings = { ...baseGameSettings, guesses: ['HELLO', 'WO|RLD'] };
                expect(() => {
                    urlService.encodeGameSettings(settings);
                }).toThrow("Invalid character '|' found in guess[1]");
            });
        });

        describe('edge cases', () => {
            it('should handle guesses with empty strings (filtered out)', () => {
                const settings = { ...baseGameSettings, guesses: ['HELLO', '', 'WORLD'] };
                const encoded = urlService.encodeGameSettings(settings);
                const decoded = urlService.decodeGameSettings(encoded);
                // Empty guesses should be filtered out
                expect(decoded.guesses).toEqual(['HELLO', 'WORLD']);
            });
        });
    });
});
